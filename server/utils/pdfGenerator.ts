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
      margin: 30,
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
       .fillColor('#1e40af')
       .text('عقد نقل على الطرق البرية', {
         align: 'center'
       });
    doc.moveDown(0.5);

    // Contract Agreement Text (concise version)
    const legalAgreement = [
      'تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات',
      'و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية',
      'الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)',
      `الطرف الثاني : ${passengers[0]?.name || ''}`
    ];

    const legalAgreementImg = renderArabicSection('', legalAgreement);
    doc.image(legalAgreementImg, {
      fit: [500, 120],
      align: 'center'
    });
    doc.moveDown(0.5);

    // Helper function to draw a box with title
    const drawBox = (title: string, y: number, height: number) => {
      doc.rect(30, y, 535, height)
         .strokeColor('#000000')
         .lineWidth(1)
         .stroke();

      // Title background
      doc.fillColor('#f3f4f6')
         .rect(30, y, 535, 25)
         .fill();

      // Title text
      const titleImg = renderArabicSection('', [title]);
      doc.image(titleImg, 40, y + 3, {
        fit: [515, 18],
        align: 'right'
      });
    };

    // Trip Information Box
    let currentY = doc.y;
    drawBox('معلومات الرحلة / Trip Information', currentY, 90);

    const tripDetails = [
      `التاريخ / Date: ${dateStr}`,
      `من / From: ${order.fromCity}`,
      `إلى / To: ${order.toCity}`,
      `نوع التأشيرة / Visa Type: ${order.visaType}`,
      `رقم الرحلة / Trip No.: ${order.tripNumber}`
    ];

    const tripDetailsImg = renderArabicSection('', tripDetails);
    doc.image(tripDetailsImg, 40, currentY + 30, {
      fit: [515, 55],
      align: 'right'
    });

    // Driver Information Box
    currentY += 100;
    drawBox('معلومات السائق / Driver Information', currentY, 80);

    const driverDetails = [
      `اسم السائق / Driver Name: ${driver.fullName}`,
      `رقم الهوية / ID Number: ${driver.idNumber}`,
      `رقم الرخصة / License Number: ${driver.licenseNumber}`
    ];

    const driverDetailsImg = renderArabicSection('', driverDetails);
    doc.image(driverDetailsImg, 40, currentY + 30, {
      fit: [515, 45],
      align: 'right'
    });

    // Passengers Information Box
    currentY += 90;
    const passengerBoxHeight = Math.min(250, Math.max(80, passengers.length * 25 + 35));
    drawBox('معلومات الركاب / Passenger Information', currentY, passengerBoxHeight);

    const passengerDetails = passengers.map((passenger, index) => [
      `${index + 1}. اسم الراكب / Name: ${passenger.name}`,
      `   رقم الهوية / ID: ${passenger.idNumber}`,
      `   الجنسية / Nationality: ${passenger.nationality}`
    ]).flat();

    const passengerDetailsImg = renderArabicSection('', passengerDetails);
    doc.image(passengerDetailsImg, 40, currentY + 30, {
      fit: [515, passengerBoxHeight - 35],
      align: 'right'
    });

    // Add QR Code at the bottom
    currentY += passengerBoxHeight + 10;
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime,
      mainPassenger: passengers[0]?.name
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), 30, currentY, {
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