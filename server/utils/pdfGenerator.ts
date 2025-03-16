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
    doc.fontSize(24)
       .fillColor('#1e40af')
       .text('عقد نقل على الطرق البرية', {
         align: 'center'
       });
    doc.moveDown(1);

    // Contract Agreement Text (before boxes)
    const legalAgreement = [
      'تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات',
      'و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية',
      'و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية :',
      '',
      'الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)',
      `الطرف الثاني : ${passengers[0]?.name || ''}`
    ];

    const legalAgreementImg = renderArabicSection('', legalAgreement);
    doc.image(legalAgreementImg, {
      fit: [500, 200],
      align: 'center'
    });
    doc.moveDown(1);

    // Draw boxes for information
    // Helper function to draw a box with title
    const drawBox = (title: string, y: number, height: number) => {
      doc.rect(50, y, 495, height)
         .strokeColor('#000000')
         .lineWidth(1)
         .stroke();

      // Title background
      doc.fillColor('#f3f4f6')
         .rect(50, y, 495, 30)
         .fill();

      // Title text
      const titleImg = renderArabicSection('', [title]);
      doc.image(titleImg, 60, y + 5, {
        fit: [475, 20],
        align: 'right'
      });
    };

    // Trip Information Box
    let currentY = doc.y + 20;
    drawBox('معلومات الرحلة / Trip Information', currentY, 120);

    const tripDetails = [
      `التاريخ / Date: ${dateStr}`,
      `من / From: ${order.fromCity}`,
      `إلى / To: ${order.toCity}`,
      `نوع التأشيرة / Visa Type: ${order.visaType}`,
      `رقم الرحلة / Trip No.: ${order.tripNumber}`
    ];

    const tripDetailsImg = renderArabicSection('', tripDetails);
    doc.image(tripDetailsImg, 60, currentY + 40, {
      fit: [475, 70],
      align: 'right'
    });

    // Driver Information Box
    currentY += 140;
    drawBox('معلومات السائق / Driver Information', currentY, 100);

    const driverDetails = [
      `اسم السائق / Driver Name: ${driver.fullName}`,
      `رقم الهوية / ID Number: ${driver.idNumber}`,
      `رقم الرخصة / License Number: ${driver.licenseNumber}`
    ];

    const driverDetailsImg = renderArabicSection('', driverDetails);
    doc.image(driverDetailsImg, 60, currentY + 40, {
      fit: [475, 50],
      align: 'right'
    });

    // Passengers Information Box
    currentY += 120;
    const passengerBoxHeight = Math.max(100, passengers.length * 30 + 40);
    drawBox('معلومات الركاب / Passenger Information', currentY, passengerBoxHeight);

    const passengerDetails = passengers.map((passenger, index) => [
      `${index + 1}. اسم الراكب / Name: ${passenger.name}`,
      `   رقم الهوية / ID: ${passenger.idNumber}`,
      `   الجنسية / Nationality: ${passenger.nationality}`
    ]).flat();

    const passengerDetailsImg = renderArabicSection('', passengerDetails);
    doc.image(passengerDetailsImg, 60, currentY + 40, {
      fit: [475, passengerBoxHeight - 50],
      align: 'right'
    });

    // Add QR Code at the bottom
    currentY += passengerBoxHeight + 20;
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime,
      mainPassenger: passengers[0]?.name
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), 50, currentY, {
      fit: [100, 100]
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