import sys
import json
import logging
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
import arabic_reshaper
from bidi.algorithm import get_display
import os
import qrcode
from io import BytesIO
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def reshape_arabic(text):
    """Reshape Arabic text for proper rendering"""
    try:
        reshaped_text = arabic_reshaper.reshape(str(text))
        return get_display(reshaped_text)
    except Exception as e:
        logger.error(f"Error reshaping text: {text}, Error: {str(e)}")
        return text

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering"""
    try:
        logger.info(f"Starting PDF generation. Data path: {data_path}, Output path: {output_path}")

        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        logger.info("Data loaded successfully")

        # Create PDF
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4

        # Set initial position
        current_y = height - 50

        # Draw title
        c.setFont("Helvetica-Bold", 16)
        title = reshape_arabic("عقد نقل على الطرق البرية")
        c.drawCentredString(width/2, current_y, title)
        current_y -= 40

        # Contract agreement text
        c.setFont("Helvetica", 10)
        agreement_text = [
            "تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات",
            "و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية",
            "",
            "الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)",
            f"الطرف الثاني : {data['main_passenger']}"
        ]

        for line in agreement_text:
            if line:
                reshaped_line = reshape_arabic(line)
                text_width = c.stringWidth(reshaped_line, "Helvetica", 10)
                c.drawRightString(width - 50, current_y, reshaped_line)
            current_y -= 20

        def draw_box(title, content, height):
            nonlocal current_y

            # Box outline
            box_width = width - 100
            c.rect(50, current_y - height, box_width, height)

            # Grey header
            c.setFillColor(colors.lightgrey)
            c.rect(50, current_y - 30, box_width, 30, fill=1)
            c.setFillColor(colors.black)

            # Title
            title_text = reshape_arabic(title)
            c.setFont("Helvetica-Bold", 12)
            title_width = c.stringWidth(title_text, "Helvetica-Bold", 12)
            c.drawRightString(width - 60, current_y - 20, title_text)

            # Content
            c.setFont("Helvetica", 10)
            content_y = current_y - 50
            for line in content:
                text = reshape_arabic(line)
                text_width = c.stringWidth(text, "Helvetica", 10)
                c.drawRightString(width - 60, content_y, text)
                content_y -= 20

            current_y = current_y - height - 10

        # Trip Information Box
        current_y = height - 250
        trip_info = [
            f"التاريخ / Date: {data['date']}",
            f"من / From: {data['from_city']}",
            f"إلى / To: {data['to_city']}",
            f"نوع التأشيرة / Visa Type: {data['visa_type']}",
            f"رقم الرحلة / Trip No.: {data['trip_number']}"
        ]
        draw_box("معلومات الرحلة / Trip Information", trip_info, 120)
        logger.info("Trip information box added successfully")

        # Driver Information Box
        driver_info = [
            f"اسم السائق / Driver Name: {data['driver_name']}",
            f"رقم الهوية / ID Number: {data['driver_id']}",
            f"رقم الرخصة / License Number: {data['license_number']}"
        ]
        draw_box("معلومات السائق / Driver Information", driver_info, 100)
        logger.info("Driver information box added successfully")

        # Passenger Information Box
        passenger_info = []
        for i, passenger in enumerate(data['passengers'], 1):
            passenger_info.extend([
                f"{i}. {passenger['name']}",
                f"رقم الهوية / ID: {passenger['id_number']}",
                f"الجنسية / Nationality: {passenger['nationality']}"
            ])

        box_height = min(200, len(passenger_info) * 20 + 40)
        draw_box("معلومات الركاب / Passenger Information", passenger_info, box_height)
        logger.info("Passenger information box added successfully")

        # Add QR Code
        try:
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr_data = f"Order: {data['trip_number']}, From: {data['from_city']}, To: {data['to_city']}"
            qr.add_data(qr_data)
            qr.make(fit=True)
            qr_img = qr.make_image(fill_color="black", back_color="white")

            qr_buffer = BytesIO()
            qr_img.save(qr_buffer)
            qr_buffer.seek(0)

            c.drawImage(qr_buffer, 50, current_y - 100, width=100, height=100)
            logger.info("QR code added successfully")
        except Exception as e:
            logger.error(f"Error adding QR code: {str(e)}")

        # Save the PDF
        c.save()
        logger.info(f"PDF saved successfully at: {output_path}")
        return os.path.basename(output_path)

    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 3:
        logger.error("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    try:
        data_path = sys.argv[1]
        output_path = sys.argv[2]
        generate_pdf(data_path, output_path)
    except Exception as e:
        logger.error(f"Main execution error: {str(e)}")
        sys.exit(1)