import sys
import json
import logging
from pathlib import Path
import qrcode
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_qr_code(pdf_filename):
    """Generate QR code for the PDF"""
    try:
        base_url = "http://localhost:5000"
        pdf_url = f"{base_url}/uploads/{pdf_filename}"
        logger.info(f"Generating QR code for URL: {pdf_url}")

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(pdf_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        qr_bytes = BytesIO()
        qr_img.save(qr_bytes, format="PNG")
        qr_bytes.seek(0)
        return qr_bytes.getvalue()
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    """Generate PDF with ReportLab"""
    try:
        logger.info(f"Starting PDF generation. Output path: {output_path}")

        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info("Data loaded successfully")

        # Generate QR code
        qr_code_bytes = generate_qr_code(Path(output_path).name)
        logger.info("QR code generated")

        # Create PDF
        c = canvas.Canvas(str(output_path), pagesize=A4)
        width, height = A4
        margin = 2 * cm

        # Add QR code
        c.drawImage(BytesIO(qr_code_bytes), margin, height - 3*cm, width=2*cm, height=2*cm)

        # Add title
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width/2, height - 2*cm, "عقد نقل على الطرق البرية")

        # Add content
        c.setFont("Helvetica", 12)
        y_position = height - 4*cm

        # Trip information
        c.drawString(margin, y_position, f"التاريخ: {data['date']}")
        y_position -= 30
        c.drawString(margin, y_position, f"من: {data['from_city']}")
        y_position -= 30
        c.drawString(margin, y_position, f"إلى: {data['to_city']}")
        y_position -= 30
        c.drawString(margin, y_position, f"نوع التأشيرة: {data['visa_type']}")
        y_position -= 30
        c.drawString(margin, y_position, f"رقم الرحلة: {data['trip_number']}")
        y_position -= 40

        # Driver information
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, "معلومات السائق")
        c.setFont("Helvetica", 12)
        y_position -= 30

        c.drawString(margin, y_position, f"اسم السائق: {data['driver_name']}")
        y_position -= 20
        c.drawString(margin, y_position, f"رقم الهوية: {data['driver_id']}")
        y_position -= 20
        c.drawString(margin, y_position, f"رقم الرخصة: {data['license_number']}")
        y_position -= 40

        # Passenger information
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, "معلومات الركاب")
        c.setFont("Helvetica", 12)
        y_position -= 30

        for i, passenger in enumerate(data['passengers'], 1):
            c.drawString(margin, y_position, f"{i}. {passenger['name']}")
            y_position -= 20
            c.drawString(margin + cm, y_position, f"رقم الهوية: {passenger['id_number']}")
            y_position -= 20
            c.drawString(margin + cm, y_position, f"الجنسية: {passenger['nationality']}")
            y_position -= 30

        # Save the PDF
        c.save()
        logger.info(f"PDF saved at: {output_path}")

        return Path(output_path).name

    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    try:
        data_path = sys.argv[1]
        output_path = sys.argv[2]
        generate_pdf(data_path, output_path)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)