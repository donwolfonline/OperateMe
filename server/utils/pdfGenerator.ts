import PDFDocument from 'pdfkit';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
    // Create a single instance of PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      autoFirstPage: true
    });

    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // QR Code generation - do this only once
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      passengerName: order.passengerName,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime
    });

    // Generate QR code first to avoid duplication
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    // Start with English header
    doc.font('Helvetica-Bold')
       .fontSize(24)
       .fillColor('#1d4ed8')
       .text('Lightning Road Transport', {
         align: 'center'
       });

    // Add QR Code once
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), {
      width: 100,
      align: 'right'
    });

    doc.moveDown(2);

    // Trip Details Section
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .fillColor('#000000')
       .text('Trip Details', { align: 'left' });

    doc.font('Helvetica')
       .fontSize(12)
       .moveDown(0.5);

    // Trip information in both languages
    const dateStr = new Date(order.departureTime).toLocaleString('ar-SA', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    const details = [
      `Passenger Name / اسم المسافر: ${order.passengerName}`,
      `Phone / رقم الهاتف: ${order.passengerPhone}`,
      `From / من: ${order.fromCity}`,
      `To / إلى: ${order.toCity}`,
      `Departure / موعد المغادرة: ${dateStr}`
    ];

    details.forEach(detail => {
      doc.text(detail, {
        align: 'left'
      });
    });

    doc.moveDown(2);

    // Driver Details
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text('Driver Information / معلومات السائق', { align: 'left' });

    doc.font('Helvetica')
       .fontSize(12)
       .moveDown(0.5)
       .text(`Driver Name / اسم السائق: ${driver.fullName}`)
       .text(`License Number / رقم الرخصة: ${driver.licenseNumber}`);

    doc.moveDown(2);

    // Contract Title
    doc.font('Helvetica-Bold')
       .fontSize(16)
       .text('Contract Agreement / عقد النقل', {
         align: 'center'
       });

    doc.moveDown();

    // Contract terms in simple format
    doc.font('Helvetica')
       .fontSize(12);

    const contractTerms = [
      '1. The driver commits to arrive at the specified time',
      'يلتزم السائق بالوصول في الموعد المحدد',
      '',
      '2. Passengers must follow safety instructions',
      'يجب على الركاب الالتزام بتعليمات السلامة',
      '',
      '3. The company reserves the right to cancel trips in emergency situations',
      'يحق للشركة إلغاء الرحلة في حالة الظروف الطارئة'
    ];

    contractTerms.forEach(term => {
      doc.text(term, {
        align: 'left'
      });
      doc.moveDown(0.5);
    });

    // Finalize PDF
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(pdfFileName));
      stream.on('error', reject);
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}