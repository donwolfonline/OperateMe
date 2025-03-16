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
      layout: 'portrait',
      autoFirstPage: true
    });

    // Add built-in Helvetica font for English text
    doc.font('Helvetica');

    // Pipe output to file
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Generate QR Code
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      passengerName: order.passengerName,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime
    });

    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    // Add header
    doc.fontSize(24)
      .fillColor('#1d4ed8')
      .text('Lightning Road Transport', { align: 'center' });
    doc.moveDown();

    // Add QR Code
    doc.image(Buffer.from(qrCodeImage.split(',')[1], 'base64'), {
      width: 100,
      align: 'right'
    });
    doc.moveDown();

    // English sections
    doc.fontSize(16)
      .fillColor('#1e40af')
      .text('Trip Details:', { align: 'left', underline: true });
    doc.fontSize(12)
      .fillColor('#000000')
      .text(`Passenger Name: ${order.passengerName}`, { align: 'left' })
      .text(`Passenger Phone: ${order.passengerPhone}`, { align: 'left' })
      .text(`From: ${order.fromCity}`, { align: 'left' })
      .text(`To: ${order.toCity}`, { align: 'left' })
      .text(`Departure Time: ${new Date(order.departureTime).toLocaleString('ar-SA')}`, { align: 'left' });
    doc.moveDown();

    doc.fontSize(16)
      .fillColor('#1e40af')
      .text('Driver Details:', { align: 'left', underline: true });
    doc.fontSize(12)
      .fillColor('#000000')
      .text(`Driver Name: ${driver.fullName}`, { align: 'left' })
      .text(`License Number: ${driver.licenseNumber}`, { align: 'left' });
    doc.moveDown();

    doc.fontSize(16)
      .fillColor('#1e40af')
      .text('Contract Agreement', { align: 'center' });
    doc.moveDown();

    // Arabic text sections as image
    const arabicText = [
      'تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل',
      'ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية :',
      'الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)',
      `الطرف الثاني : ${order.passengerName}`,
      'اتفق الطرفان على أن ينفذ الطرف اول عملية النقل للطرف الثاني مع مرافقيه و ذويهم من الموقع المحدد مسبقا مع الطرف الثاني و توصيلهم الى الجهه المحدده بالعقد ۔',
      `النقل من : ${order.fromCity}`,
      `الوصول الى : ${order.toCity}`,
      'في حالة الغاء التعاقد الى سبب شخصى او أسباب أخرى تتعلق في الحجوزات او الانظمة تكون سياسة إلالغاء و الاستبدال حسب نظام وزارة التجارة السعودى في حالة الحجز و تم الإلغاء قبل موعد الرحله بأكثر من 24 ساعه يتم استرداد المبلغ كامل .',
      'وفي حالة طلب المبلغ كامل الطرف الثاني الحجز من خلال الموقع الالكتروني لشركة يعتبر هذا الحجز و موافقته على الشروط و الحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الاول',
      'بواسطة حافلات الشركة المرخصه و المتوافقه مع الاشتراطات المقررة من هيئة النقل ۔'
    ];

    // Function to draw right-aligned text
    function drawRightAlignedText(text: string) {
      const textWidth = doc.widthOfString(text);
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const x = doc.page.width - doc.page.margins.right - textWidth;
      doc.text(text, x, doc.y);
      doc.moveDown(0.5);
    }

    // Write Arabic text
    doc.fontSize(12)
      .fillColor('#000000');

    arabicText.forEach(text => {
      drawRightAlignedText(text);
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