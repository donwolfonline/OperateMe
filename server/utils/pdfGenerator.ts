import PDFDocument from 'pdfkit';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import { PDFLayoutManager } from './pdfLayoutManager';

export async function generateOrderPDF(order: OperationOrder, driver: User): Promise<string> {
  try {
    // Create PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      autoFirstPage: true
    });

    const layoutManager = new PDFLayoutManager(doc);
    const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Generate QR Code once
    if (!layoutManager.hasContent('qr-code')) {
      const qrCodeData = JSON.stringify({
        orderId: order.id,
        passengerName: order.passengerName,
        fromCity: order.fromCity,
        toCity: order.toCity,
        departureTime: order.departureTime
      });
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData);
      layoutManager.addSection('qr-code', qrCodeDataUrl);
      doc.image(Buffer.from(qrCodeDataUrl.split(',')[1], 'base64'), {
        width: 100,
        align: 'right'
      });
    }

    // Add header
    if (!layoutManager.hasContent('header')) {
      layoutManager.addSection('header', 'Lightning Road Transport');
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#1d4ed8')
         .text('Lightning Road Transport', {
           align: 'center'
         });
      doc.moveDown(2);
    }

    // Format date in Arabic
    const dateStr = new Date(order.departureTime).toLocaleString('ar-SA', {
      dateStyle: 'full',
      timeStyle: 'short'
    });

    // Add trip details with Arabic text
    if (!layoutManager.hasContent('trip-details')) {
      layoutManager.addSection('trip-details', 'Trip Details');
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .fillColor('#000000')
         .text('Trip Details / تفاصيل الرحلة', { align: 'right' });

      doc.font('Helvetica')
         .fontSize(12)
         .moveDown(0.5);

      // Using Arabic numerals and RTL text
      const details = [
        `اسم المسافر: ${order.passengerName}`,
        `رقم الهاتف: ${order.passengerPhone}`,
        `من: ${order.fromCity}`,
        `إلى: ${order.toCity}`,
        `موعد المغادرة: ${dateStr}`
      ];

      details.forEach(detail => {
        doc.text(detail, {
          align: 'right',
          features: ['rtla', 'arab']
        });
      });
      doc.moveDown();
    }

    // Add driver details
    if (!layoutManager.hasContent('driver-details')) {
      layoutManager.addSection('driver-details', 'Driver Details');
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('معلومات السائق', { align: 'right' });

      doc.font('Helvetica')
         .fontSize(12)
         .moveDown(0.5);

      const driverDetails = [
        `اسم السائق: ${driver.fullName}`,
        `رقم الرخصة: ${driver.licenseNumber}`
      ];

      driverDetails.forEach(detail => {
        doc.text(detail, {
          align: 'right',
          features: ['rtla', 'arab']
        });
      });
      doc.moveDown();
    }

    // Add contract
    if (!layoutManager.hasContent('contract')) {
      layoutManager.addSection('contract', 'Contract');
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('عقد النقل', { align: 'right' });

      doc.font('Helvetica')
         .fontSize(12)
         .moveDown();

      const contractTerms = [
        'يلتزم السائق بالوصول في الموعد المحدد',
        'يجب على الركاب الالتزام بتعليمات السلامة',
        'يحق للشركة إلغاء الرحلة في حالة الظروف الطارئة'
      ];

      contractTerms.forEach((term, index) => {
        doc.text(`${index + 1}. ${term}`, {
          align: 'right',
          features: ['rtla', 'arab']
        });
        doc.moveDown(0.5);
      });
    }

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