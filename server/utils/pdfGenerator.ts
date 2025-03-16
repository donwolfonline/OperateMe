import html_to_pdf from 'html-pdf-node';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
    // Generate QR Code
    const qrCodeData = JSON.stringify({
      orderId: order.id,
      passengerName: order.passengerName,
      fromCity: order.fromCity,
      toCity: order.toCity,
      departureTime: order.departureTime
    });
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);

    // Create simple HTML content
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { direction: rtl; padding: 20px; font-family: Arial, sans-serif; }
          .header { text-align: center; margin-bottom: 20px; }
          .qr-code { text-align: left; }
          .section { margin: 20px 0; padding: 10px; border: 1px solid #ccc; }
        </style>
      </head>
      <body>
        <div class="header">Lightning Road Transport</div>
        <div class="qr-code">
          <img src="${qrCodeDataUrl}" width="100">
        </div>
        <div class="section">
          <h3>تفاصيل الرحلة</h3>
          <p>اسم المسافر: ${order.passengerName}</p>
          <p>رقم الهاتف: ${order.passengerPhone}</p>
          <p>من: ${order.fromCity}</p>
          <p>إلى: ${order.toCity}</p>
          <p>وقت المغادرة: ${new Date(order.departureTime).toLocaleString('ar-SA')}</p>
        </div>
        <div class="section">
          <h3>معلومات السائق</h3>
          <p>اسم السائق: ${driver.fullName}</p>
          <p>رقم الرخصة: ${driver.licenseNumber}</p>
        </div>
      </body>
      </html>
    `;

    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);

    // Generate PDF with minimal options
    const file = { content: html };
    const options = { format: 'A4' };

    const buffer = await html_to_pdf.generatePdf(file, options);
    fs.writeFileSync(pdfPath, buffer);

    return pdfFileName;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}