import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import { storage } from '../storage';
import { spawn } from 'child_process';
import { promisify } from 'util';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
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

    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);

    // Write data to temporary JSON file
    const tempDataPath = path.join(process.cwd(), 'uploads', `temp_${Date.now()}.json`);
    await promisify(fs.writeFile)(tempDataPath, JSON.stringify(data));

    // Run Python script
    await new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [
        path.join(process.cwd(), 'server/utils/pdf_generator.py'),
        tempDataPath,
        pdfPath
      ]);

      pythonProcess.on('close', (code) => {
        // Clean up temp file
        fs.unlink(tempDataPath, () => {});

        if (code === 0) {
          resolve(null);
        } else {
          reject(new Error(`Python process exited with code ${code}`));
        }
      });

      pythonProcess.on('error', (err) => {
        reject(err);
      });
    });

    return pdfFileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}