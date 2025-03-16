import PDFDocument from 'pdfkit';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import { renderArabicSection } from './arabicTextRenderer';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      autoFirstPage: true
    });

    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Header - English only
    doc.fontSize(24)
       .fillColor('#1e40af')
       .text('Lightning Road Transport', {
         align: 'center'
       });
    doc.moveDown(2);

    // Format date
    const dateStr = new Date(order.departureTime).toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Trip details section
    const tripDetails = [
      `بيانات الراكب / Passenger Name: ${order.passengerName}`,
      `رقم الهاتف / Phone: ${order.passengerPhone}`,
      `المدينة / From: ${order.fromCity}`,
      `الوجهة / To: ${order.toCity}`,
      `وقت المغادرة / Departure: ${dateStr}`
    ];

    const tripDetailsImg = renderArabicSection('تفاصيل الرحلة / Trip Details', tripDetails);
    doc.image(tripDetailsImg, {
      fit: [500, 200],
      align: 'center'
    });
    doc.moveDown(2);

    // Driver details section
    const driverDetails = [
      `اسم السائق / Driver Name: ${driver.fullName}`,
      `رقم الرخصة / License Number: ${driver.licenseNumber}`
    ];

    const driverDetailsImg = renderArabicSection('معلومات السائق / Driver Information', driverDetails);
    doc.image(driverDetailsImg, {
      fit: [500, 100],
      align: 'center'
    });
    doc.moveDown(2);

    // Contract section
    const contractTerms = [
      '١. يلتزم السائق بالوصول في الموعد المحدد',
      '١.١ The driver commits to arrive at the specified time',
      '',
      '٢. يجب على الركاب الالتزام بتعليمات السلامة',
      '٢.١ Passengers must follow safety instructions',
      '',
      '٣. يحق للشركة إلغاء الرحلة في حالة الظروف الطارئة',
      '٣.١ The company reserves the right to cancel trips in emergency situations'
    ];

    const contractImg = renderArabicSection('عقد النقل / Contract Agreement', contractTerms);
    doc.image(contractImg, {
      fit: [500, 300],
      align: 'center'
    });
    doc.moveDown(2);

    // Generate QR Code at the end
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      passengerName: order.passengerName,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), {
      width: 100,
      align: 'right'
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