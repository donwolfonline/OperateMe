import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { OperationOrder, User } from "@shared/schema";
import fs from 'fs';
import path from 'path';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    layout: 'portrait'
  });

  const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
  const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);
  const stream = fs.createWriteStream(pdfPath);

  // Generate QR Code
  const qrCodeData = JSON.stringify({
    orderId: order.id,
    passengerName: order.passengerName,
    fromCity: order.fromCity,
    toCity: order.toCity,
    departureTime: order.departureTime
  });

  const qrCodeImage = await QRCode.toDataURL(qrCodeData);

  // Create PDF
  doc.pipe(stream);

  // Add company header
  doc.fontSize(24)
    .fillColor('#1d4ed8')
    .text('Lightning Road Transport', { align: 'center' });
  doc.moveDown();

  // Add QR Code
  doc.image(qrCodeImage, { width: 100, align: 'right' });
  doc.moveDown();

  // Add trip details section
  doc.fontSize(16)
    .fillColor('#1e40af')
    .text('Trip Details:', { underline: true });
  doc.fontSize(12)
    .fillColor('#000000')
    .text(`Passenger Name: ${order.passengerName}`)
    .text(`Passenger Phone: ${order.passengerPhone}`)
    .text(`From: ${order.fromCity}`)
    .text(`To: ${order.toCity}`)
    .text(`Departure Time: ${order.departureTime.toLocaleString('ar-SA')}`)
    .moveDown();

  // Add driver details section
  doc.fontSize(16)
    .fillColor('#1e40af')
    .text('Driver Details:', { underline: true });
  doc.fontSize(12)
    .fillColor('#000000')
    .text(`Driver Name: ${driver.fullName}`)
    .text(`License Number: ${driver.licenseNumber}`)
    .moveDown();

  // Add contract agreement header
  doc.fontSize(16)
    .fillColor('#1e40af')
    .text('Contract Agreement', { align: 'center' });
  doc.moveDown();

  // Write Arabic text with RTL alignment
  const writeRTLText = (text: string) => {
    doc.text(text, {
      align: 'right',
      direction: 'rtl'
    });
  };

  // Contract text sections
  writeRTLText('تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل');
  doc.moveDown(0.5);
  writeRTLText('ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية :');
  doc.moveDown(0.5);
  writeRTLText('الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)');
  doc.moveDown(0.5);
  writeRTLText(`الطرف الثاني : ${order.passengerName}`);
  doc.moveDown(0.5);
  writeRTLText('اتفق الطرفان على أن ينفذ الطرف اول عملية النقل للطرف الثاني مع مرافقيه و ذويهم من الموقع المحدد مسبقا مع الطرف الثاني و توصيلهم الى الجهه المحدده بالعقد ۔');
  doc.moveDown(0.5);
  writeRTLText(`النقل من : ${order.fromCity}`);
  doc.moveDown(0.5);
  writeRTLText(`الوصول الى : ${order.toCity}`);
  doc.moveDown(0.5);
  writeRTLText('في حالة الغاء التعاقد الى سبب شخصى او أسباب أخرى تتعلق في الحجوزات او الانظمة تكون سياسة إلالغاء و الاستبدال حسب نظام وزارة التجارة السعودى في حالة الحجز و تم الإلغاء قبل موعد الرحله بأكثر من 24 ساعه يتم استرداد المبلغ كامل .');
  doc.moveDown(0.5);
  writeRTLText('وفي حالة طلب المبلغ كامل الطرف الثاني الحجز من خلال الموقع الالكتروني لشركة يعتبر هذا الحجز و موافقته على الشروط و الحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الاول');
  doc.moveDown(0.5);
  writeRTLText('بواسطة حافلات الشركة المرخصه و المتوافقه مع الاشتراطات المقررة من هيئة النقل ۔');

  // End the document
  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(pdfFileName));
    stream.on('error', reject);
  });
}