import PDFDocument from 'pdfkit';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);

    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      autoFirstPage: true
    });

    // Pipe output to file
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Set up fonts
    doc.font('Helvetica');

    // Add company header
    doc.fontSize(24)
      .fillColor('#1d4ed8')
      .text('Lightning Road Transport', {
        align: 'center'
      });
    doc.moveDown();

    // Generate and add QR Code (only once)
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      passengerName: order.passengerName,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime
    });

    const qrCodeImage = await QRCode.toDataURL(qrCodeData);
    doc.image(Buffer.from(qrCodeImage.split(',')[1], 'base64'), {
      width: 100,
      align: 'right'
    });
    doc.moveDown(2);

    // Add trip details
    doc.fontSize(14)
      .fillColor('#000000');

    const tripDetails = [
      ['Passenger Name:', order.passengerName],
      ['Passenger Phone:', order.passengerPhone],
      ['From:', order.fromCity],
      ['To:', order.toCity],
      ['Departure Time:', new Date(order.departureTime).toLocaleString('ar-SA')]
    ];

    tripDetails.forEach(([label, value]) => {
      doc.text(label, { continued: true })
         .text(`  ${value}`, { align: 'left' });
    });

    doc.moveDown(2);

    // Add driver details
    const driverDetails = [
      ['Driver Name:', driver.fullName],
      ['License Number:', driver.licenseNumber]
    ];

    driverDetails.forEach(([label, value]) => {
      doc.text(label, { continued: true })
         .text(`  ${value}`, { align: 'left' });
    });

    doc.moveDown(2);

    // Contract title
    doc.fontSize(16)
      .fillColor('#1e40af')
      .text('Contract Agreement', { align: 'center' });
    doc.moveDown();

    // Add Arabic contract text
    doc.fontSize(12)
      .fillColor('#000000');

    function writeRTLText(text: string) {
      const textOptions = {
        align: 'right' as const,
        lineBreak: true,
        paragraphGap: 10
      };
      doc.text(text, textOptions);
    }

    const arabicText = [
      'عقد نقل ركاب',
      `اسم الراكب: ${order.passengerName}`,
      `رقم الهاتف: ${order.passengerPhone}`,
      `مدينة الانطلاق: ${order.fromCity}`,
      `مدينة الوصول: ${order.toCity}`,
      `موعد المغادرة: ${new Date(order.departureTime).toLocaleString('ar-SA')}`,
      'شروط وأحكام النقل:',
      '١. يلتزم السائق بالوصول في الموعد المحدد',
      '٢. يجب على الركاب الالتزام بتعليمات السلامة',
      '٣. يحق للشركة إلغاء الرحلة في حالة الظروف الطارئة',
      'توقيع العقد'
    ];

    arabicText.forEach(text => {
      writeRTLText(text);
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