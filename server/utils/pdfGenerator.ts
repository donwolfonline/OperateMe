import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import fs from 'fs';
import { storage } from '../storage';
import { spawn } from 'child_process';
import { promisify } from 'util';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
    try {
        console.log('Starting PDF generation for order:', order.id);

        // Get vehicle information
        const vehicle = await storage.getVehicleByOrder(order.id);
        console.log('Raw vehicle information:', vehicle);

        // Get passengers for this order
        const passengers = await storage.getPassengersByOrder(order.id);

        // Format date
        const dateStr = new Date(order.departureTime).toLocaleString('ar-SA', {
            timeZone: 'Asia/Riyadh',
            dateStyle: 'full',
            timeStyle: 'short'
        });

        // Prepare data for Python script
        const data = {
            date: dateStr,
            from_city: order.fromCity,
            to_city: order.toCity,
            visa_type: order.visaType,
            trip_number: order.tripNumber,
            driver_name: driver.fullName,
            driver_id: driver.idNumber,
            license_number: driver.licenseNumber,
            main_passenger: passengers[0]?.name || '',
            passengers: passengers.map(p => ({
                name: p.name,
                id_number: p.idNumber,
                nationality: p.nationality
            })),
            vehicle_type: vehicle?.type || '',
            vehicle_model: vehicle?.model || ''
        };

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            await promisify(fs.mkdir)(uploadsDir, { recursive: true });
            console.log('Created uploads directory');
        }

        const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(uploadsDir, pdfFileName);
        console.log('PDF will be generated at:', pdfPath);

        // Write data to temporary JSON file
        const tempDataPath = path.join(uploadsDir, `temp_${Date.now()}.json`);
        await promisify(fs.writeFile)(tempDataPath, JSON.stringify(data, null, 2));
        console.log('Temporary data file written to:', tempDataPath);

        // Run Python script with detailed error handling
        await new Promise((resolve, reject) => {
            console.log('Spawning Python process...');
            const pythonProcess = spawn('python', [
                path.join(process.cwd(), 'server/utils/pdf_generator.py'),
                tempDataPath,
                pdfPath
            ], {
                env: {
                    ...process.env,
                    PYTHONPATH: process.cwd()
                }
            });

            let stdoutData = '';
            let stderrData = '';

            pythonProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log('Python script output:', data.toString());
            });

            pythonProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.error('Python script error:', data.toString());
            });

            pythonProcess.on('close', (code) => {
                // Clean up temp file
                fs.unlink(tempDataPath, (err) => {
                    if (err) console.error('Error deleting temp file:', err);
                });

                if (code === 0) {
                    // Verify the PDF exists and is not empty
                    try {
                        const stats = fs.statSync(pdfPath);
                        if (stats.size > 0) {
                            console.log('PDF generated successfully at:', pdfPath);
                            resolve(null);
                        } else {
                            reject(new Error('Generated PDF file is empty'));
                        }
                    } catch (error) {
                        reject(new Error('PDF file was not created properly'));
                    }
                } else {
                    console.error('Python process failed:', {
                        code,
                        stdout: stdoutData,
                        stderr: stderrData
                    });
                    reject(new Error(`Python process exited with code ${code}. Error: ${stderrData}`));
                }
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start Python process:', err);
                reject(err);
            });
        });

        // Final verification - Redundant, removed.  The check inside the promise is sufficient.
        

        console.log('PDF generation completed successfully');
        return pdfFileName;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}