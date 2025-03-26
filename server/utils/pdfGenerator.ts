import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import fs from 'fs';
import { storage } from '../storage';
import { spawn } from 'child_process';
import { promisify } from 'util';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
    try {
        console.log('Starting PDF generation for order:', order.id);

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
            }))
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

        // Run Python script
        await new Promise((resolve, reject) => {
            console.log('Spawning Python process...');
            const pythonProcess = spawn('python', [
                path.join(process.cwd(), 'server/utils/pdf_generator.py'),
                tempDataPath,
                pdfPath
            ]);

            pythonProcess.stdout.on('data', (data) => {
                console.log('Python script output:', data.toString());
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error('Python script error:', data.toString());
            });

            pythonProcess.on('close', (code) => {
                // Clean up temp file
                fs.unlink(tempDataPath, (err) => {
                    if (err) console.error('Error deleting temp file:', err);
                });

                if (code === 0) {
                    resolve(null);
                } else {
                    reject(new Error(`Python process exited with code ${code}`));
                }
            });

            pythonProcess.on('error', (err) => {
                console.error('Failed to start Python process:', err);
                reject(err);
            });
        });

        // Verify the PDF exists
        if (!fs.existsSync(pdfPath)) {
            throw new Error(`PDF file not found at ${pdfPath}`);
        }

        console.log('PDF generation completed successfully');
        return pdfFileName;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}