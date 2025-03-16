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

    // First Page: Trip and Passenger Details
    doc.fontSize(24)
       .fillColor('#1e40af')
       .text('Lightning Road Transport', {
         align: 'center'
       });
    doc.moveDown(2);

    // Trip details section
    const tripDetails = [
      `من / From: ${order.fromCity}`,
      `إلى / To: ${order.toCity}`,
      `موعد المغادرة / Departure: ${dateStr}`
    ];

    const tripDetailsImg = renderArabicSection('تفاصيل الرحلة / Trip Details', tripDetails);
    doc.image(tripDetailsImg, {
      fit: [500, 120],
      align: 'center'
    });
    doc.moveDown(2);

    // Draw a separator line
    doc.strokeColor('#e5e7eb')
       .lineWidth(1)
       .moveTo(50, doc.y)
       .lineTo(545, doc.y)
       .stroke();
    doc.moveDown(2);

    // Passenger details section
    if (passengers.length > 0) {
      const passengerDetails = passengers.map(passenger => [
        `اسم الراكب / Passenger Name: ${passenger.name}`,
        `رقم الهوية / ID Number: ${passenger.idNumber}`,
        `الجنسية / Nationality: ${passenger.nationality}`,
        `رقم الهاتف / Phone: ${passenger.phone || 'N/A'}`
      ]).flat();

      const passengerDetailsImg = renderArabicSection('بيانات الركاب / Passenger Details', passengerDetails);
      doc.image(passengerDetailsImg, {
        fit: [500, 200],
        align: 'center'
      });
      doc.moveDown(2);

      // Draw a separator line
      doc.strokeColor('#e5e7eb')
         .lineWidth(1)
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke();
      doc.moveDown(2);
    }

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

    // Legal Agreement on a new page
    doc.addPage();

    const legalAgreement = [
      'تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل',
      '',
      'ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية :',
      '',
      'الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)',
      `الطرف الثاني : ${passengers[0]?.name || ''}`,
      '',
      'اتفق الطرفان على أن ينفذ الطرف اول عملية النقل للطرف الثاني مع مرافقيه و ذويهم من الموقع المحدد مسبقا مع الطرف الثاني و توصيلهم الى الجهه المحدده بالعقد ۔',
      '',
      `النقل من : ${order.fromCity}`,
      `الوصول الى : ${order.toCity}`,
      '',
      'في حالة الغاء التعاقد الى سبب شخصى او أسباب أخرى تتعلق في الحجوزات او الانظمة تكون سياسة إلالغاء و الاستبدال حسب نظام وزارة التجارة السعودى في حالة الحجز و تم الإلغاء قبل موعد الرحله بأكثر من 24 ساعه يتم استرداد المبلغ كامل .',
      '',
      'وفي حالة طلب المبلغ كامل الطرف الثاني الحجز من خلال الموقع الالكتروني لشركة يعتبر هذا الحجز و موافقته على الشروط و الحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الاول'
    ];

    const legalAgreementImg = renderArabicSection('عقد النقل / Contract Agreement', legalAgreement);
    doc.image(legalAgreementImg, {
      fit: [500, 600],
      align: 'center'
    });

    // Terms and QR Code on a new page
    doc.addPage();

    // Generate QR Code
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime,
      mainPassenger: passengers[0]?.name
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    // Contract terms section
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

    const contractTermsImg = renderArabicSection('الشروط والأحكام / Terms and Conditions', contractTerms);
    doc.image(contractTermsImg, {
      fit: [500, 250],
      align: 'center'
    });
    doc.moveDown(4);

    // Add QR Code at the bottom left with proper spacing
    doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), {
      width: 100,
      x: 50,
      y: doc.page.height - 150
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