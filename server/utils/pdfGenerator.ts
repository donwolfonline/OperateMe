import puppeteer from 'puppeteer';
import { OperationOrder, User } from "@shared/schema";
import path from 'path';
import QRCode from 'qrcode';
import Handlebars from 'handlebars';

const template = `
<!DOCTYPE html>
<html dir="rtl">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap');

        body {
            font-family: 'Noto Naskh Arabic', Arial, sans-serif;
            margin: 40px;
            color: #333;
        }

        .header {
            text-align: center;
            color: #1d4ed8;
            margin-bottom: 30px;
        }

        .qr-code {
            text-align: left;
            margin: 20px 0;
        }

        .section {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }

        .section-title {
            color: #1e40af;
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .details {
            margin: 10px 0;
        }

        .contract {
            text-align: right;
            line-height: 1.8;
        }

        .rtl {
            direction: rtl;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Lightning Road Transport</h1>
    </div>

    <div class="qr-code">
        <img src="{{qrCodeDataUrl}}" width="100">
    </div>

    <div class="section">
        <div class="section-title">تفاصيل الرحلة</div>
        <div class="details rtl">
            <p>اسم المسافر: {{order.passengerName}}</p>
            <p>رقم الهاتف: {{order.passengerPhone}}</p>
            <p>من: {{order.fromCity}}</p>
            <p>إلى: {{order.toCity}}</p>
            <p>وقت المغادرة: {{departureTime}}</p>
        </div>
    </div>

    <div class="section">
        <div class="section-title">معلومات السائق</div>
        <div class="details rtl">
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

        // Compile template
        const compiledTemplate = Handlebars.compile(template);
        const html = compiledTemplate({
            order,
            driver,
            qrCodeDataUrl,
            departureTime
        });

        // Launch browser
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        // Generate PDF
        const pdfFileName = `order_${order.id}_${Date.now()}.pdf`;
        const pdfPath = path.join(process.cwd(), 'uploads', pdfFileName);

        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        return pdfFileName;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}