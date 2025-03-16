import html_to_pdf from 'html-pdf-node';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import fs from 'fs';
import Handlebars from 'handlebars';

const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap');

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Noto Naskh Arabic', Arial, sans-serif;
            margin: 40px;
            direction: rtl;
            background: white;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding: 20px;
            border-bottom: 2px solid #1d4ed8;
        }

        .header h1 {
            color: #1d4ed8;
            font-size: 28px;
        }

        .qr-code {
            position: absolute;
            top: 20px;
            left: 20px;
        }

        .section {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f8fafc;
        }

        .section-title {
            color: #1e40af;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 10px;
        }

        .details p {
            margin: 8px 0;
            font-size: 16px;
            color: #334155;
        }

        .contract {
            line-height: 1.8;
            font-size: 14px;
            color: #334155;
        }

        .contract p {
            margin-bottom: 12px;
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="qr-code">
        <img src="{{qrCodeDataUrl}}" width="100">
    </div>

    <div class="header">
        <h1>Lightning Road Transport</h1>
    </div>

    <div class="section">
        <div class="section-title">تفاصيل الرحلة</div>
        <div class="details">
            <p>اسم المسافر: {{order.passengerName}}</p>
            <p>رقم الهاتف: {{order.passengerPhone}}</p>
            <p>من: {{order.fromCity}}</p>
            <p>إلى: {{order.toCity}}</p>
            <p>وقت المغادرة: {{departureTime}}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">معلومات السائق</div>
        <div class="details">
            <p>اسم السائق: {{driver.fullName}}</p>
            <p>رقم الرخصة: {{driver.licenseNumber}}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">اتفاقية العقد</div>
        <div class="contract">
            <p>تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل</p>
            <p>ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية و بما يخالف احكام هذه الائحة التي تحددها هيئة النقل و بناء على ما سبق تم ابرام عقد النقل بين الاطراف الاتية :</p>
            <p>الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)</p>
            <p>الطرف الثاني : {{order.passengerName}}</p>
            <p>اتفق الطرفان على أن ينفذ الطرف اول عملية النقل للطرف الثاني مع مرافقيه و ذويهم من الموقع المحدد مسبقا مع الطرف الثاني و توصيلهم الى الجهه المحدده بالعقد ۔</p>
            <p>النقل من : {{order.fromCity}}</p>
            <p>الوصول الى : {{order.toCity}}</p>
            <p>في حالة الغاء التعاقد الى سبب شخصى او أسباب أخرى تتعلق في الحجوزات او الانظمة تكون سياسة إلالغاء و الاستبدال حسب نظام وزارة التجارة السعودى في حالة الحجز و تم الإلغاء قبل موعد الرحله بأكثر من 24 ساعه يتم استرداد المبلغ كامل .</p>
            <p>وفي حالة طلب المبلغ كامل الطرف الثاني الحجز من خلال الموقع الالكتروني لشركة يعتبر هذا الحجز و موافقته على الشروط و الحكام بالموقع الالكتروني هو موافقة على هذا العقد لتنفيذ عملية النقل المتفق عليها مع الطرف الاول</p>
            <p>بواسطة حافلات الشركة المرخصه و المتوافقه مع الاشتراطات المقررة من هيئة النقل ۔</p>
        </div>
    </div>
</body>
</html>
`;

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

        // Format departure time
        const departureTime = new Date(order.departureTime).toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Replace template variables
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate({
            order,
            driver,
            qrCodeDataUrl,
            departureTime
        });

        const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);

        // Generate PDF with optimized settings
        const file = { content: html };
        const options = {
            format: 'A4',
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            printBackground: true,
            preferCSSPageSize: true
        };

        const buffer = await html_to_pdf.generatePdf(file, options);
        fs.writeFileSync(pdfPath, buffer);

        return pdfFileName;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}