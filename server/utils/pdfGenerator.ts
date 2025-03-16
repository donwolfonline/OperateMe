import { OperationOrder, User } from "@shared/schema";
import PDFDocument from 'pdfkit';
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import { renderArabicSection } from './arabicTextRenderer';
import { storage } from '../storage';

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

    // Get passengers for this order
    const passengers = await storage.getPassengersByOrder(order.id);

    // Format date
    const dateStr = new Date(order.departureTime).toLocaleString('ar-SA', {
      timeZone: 'Asia/Riyadh',
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Title
    doc.fontSize(20)
       .fillColor('#000000')
       .text('عقد نقل على الطرق البرية', {
         align: 'center'
       });
    doc.moveDown(1);

    // Contract Agreement Text
    const legalAgreement = [
      'تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات',
      'و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية',
      '',
      'الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)',
      `الطرف الثاني : ${passengers[0]?.name || ''}`
    ];

    const legalAgreementImg = renderArabicSection('', legalAgreement);
    doc.image(legalAgreementImg, {
      fit: [500, 150],
      align: 'center'
    });
    doc.moveDown(1);

    // Helper function to draw a box with title
    const drawBox = (title: string, content: string[], height: number) => {
      // Box outline
      doc.rect(50, doc.y, 500, height)
         .stroke();

      // Title background
      doc.fillColor('#f0f0f0')
         .rect(50, doc.y, 500, 25)
         .fill();

      // Reset fill color for text
      doc.fillColor('#000000');

      // Title text
      const titleImg = renderArabicSection('', [title]);
      doc.image(titleImg, 60, doc.y + 5, {
        fit: [480, 20],
        align: 'right'
      });

      // Content
      const contentImg = renderArabicSection('', content);
      doc.image(contentImg, 60, doc.y + 30, {
        fit: [480, height - 35],
        align: 'right'
      });

      doc.y += height + 10;
    };

    // Trip Information Box
    drawBox('معلومات الرحلة / Trip Information', [
      `التاريخ / Date: ${dateStr}`,
      `من / From: ${order.fromCity}`,
      `إلى / To: ${order.toCity}`,
      `نوع التأشيرة / Visa Type: ${order.visaType}`,
      `رقم الرحلة / Trip No.: ${order.tripNumber}`
    ], 120);

    // Driver Information Box
    drawBox('معلومات السائق / Driver Information', [
      `اسم السائق / Driver Name: ${driver.fullName}`,
      `رقم الهوية / ID Number: ${driver.idNumber}`,
      `رقم الرخصة / License Number: ${driver.licenseNumber}`
    ], 100);

    // Passengers Information Box
    const passengerDetails = passengers.map((passenger, index) => [
      `${index + 1}. ${passenger.name}`,
      `   رقم الهوية / ID: ${passenger.idNumber}`,
      `   الجنسية / Nationality: ${passenger.nationality}`
    ]).flat();

    drawBox('معلومات الركاب / Passenger Information', 
      passengerDetails,
      Math.min(200, Math.max(100, passengers.length * 25 + 40))
    );

    // Add QR Code at the bottom
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime,
      mainPassenger: passengers[0]?.name
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), 50, doc.y, {
      fit: [80, 80]
    });

    // Finalize the PDF
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