import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { OperationOrder, User } from "@shared/schema";
import fs from 'fs';
import path from 'path';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  const doc = new PDFDocument();
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

  // Add logo or header
  doc.fontSize(20).text('Lightning Road Transport', { align: 'center' });
  doc.moveDown();

  // Add QR Code
  doc.image(qrCodeImage, { width: 100, align: 'right' });
  doc.moveDown();

  // Add trip details
  doc.fontSize(14).text('Trip Details:', { underline: true });
  doc.fontSize(12)
    .text(`Passenger Name: ${order.passengerName}`)
    .text(`Passenger Phone: ${order.passengerPhone}`)
    .text(`From: ${order.fromCity}`)
    .text(`To: ${order.toCity}`)
    .text(`Departure Time: ${new Date(order.departureTime).toLocaleString('ar-SA')}`)
    .moveDown();

  // Add driver details
  doc.fontSize(14).text('Driver Details:', { underline: true });
  doc.fontSize(12)
    .text(`Driver Name: ${driver.fullName}`)
    .text(`License Number: ${driver.licenseNumber}`)
    .moveDown();

  // Add contract agreement text in Arabic
  doc.fontSize(14).text('Contract Agreement', { align: 'center' });
  doc.fontSize(12).text(`
    تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل 
    ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية : 
    الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)  
    الطرف الثاني : ${order.passengerName}
    اتفق الطرفان على أن ينفذ الطرف اول عملية النقل للطرف الثاني مع مرافقيه و ذويهم من الموقع المحدد مسبقا مع الطرف الثاني و توصيلهم الى الجهه المحدده بالعقد ۔
    النقل من : ${order.fromCity}
    الوصول الى : ${order.toCity}
    في حالة الغاء التعاقد الى سبب شخصى او أسباب أخرى تتعلق في الحجوزات او الانظمة تكون سياسة إلالغاء و الاستبدال حسب نظام وزارة التجارة السعودى في حالة الحجز و تم الإلغاء قبل موعد الرحله بأكثر من 24 ساعه يتم استرداد المبلغ كامل .
    وفي حالة طلب المبلغ كامل الطرف الثاني الحجز من خلال الموقع الالكتروني لشركة يعتبر هذا الحجز و موافقته على الشروط و الحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الاول
    بواسطة حافلات الشركة المرخصه و المتوافقه مع الاشتراطات المقررة من هيئة النقل ۔
  `, { align: 'right', rtl: true });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(pdfFileName));
    stream.on('error', reject);
  });
}