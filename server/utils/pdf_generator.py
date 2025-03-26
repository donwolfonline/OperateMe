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
        base_url = "http://localhost:5000"  # Default to local development
        pdf_url = f"{base_url}/uploads/{pdf_filename}"

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(pdf_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        # Save QR code to bytes
        qr_bytes = BytesIO()
        qr_img.save(qr_bytes, format="PNG")
        return qr_bytes.getvalue()
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    """Main PDF generation function"""
    try:
        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        logger.info("Data loaded successfully")

        # Generate QR code
        qr_code_bytes = generate_qr_code(Path(output_path).name)
        logger.info("QR code generated successfully")

        # Create PDF
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4

        # Set margins
        margin = 2 * cm

        # Add QR code
        c.drawImage(BytesIO(qr_code_bytes), margin, height - 3*cm, width=2*cm, height=2*cm)

        # Add title
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width/2, height - 2*cm, "عقد نقل على الطرق البرية")

        # Set up content area
        c.setFont("Helvetica", 12)
        y_position = height - 4*cm

        # Add basic information
        basic_info = [
            f"التاريخ: {data['date']}",
            f"من: {data['from_city']}",
            f"إلى: {data['to_city']}",
            f"نوع التأشيرة: {data['visa_type']}",
            f"رقم الرحلة: {data['trip_number']}",
        ]

        for info in basic_info:
            c.drawString(margin, y_position, info)
            y_position -= 20

        # Add driver information
        y_position -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, "معلومات السائق")
        c.setFont("Helvetica", 12)
        y_position -= 20

        driver_info = [
            f"اسم السائق: {data['driver_name']}",
            f"رقم الهوية: {data['driver_id']}",
            f"رقم الرخصة: {data['license_number']}"
        ]

        for info in driver_info:
            c.drawString(margin, y_position, info)
            y_position -= 20

        # Add passenger information
        y_position -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(margin, y_position, "معلومات الركاب")
        c.setFont("Helvetica", 12)
        y_position -= 20

        for i, passenger in enumerate(data['passengers'], 1):
            c.drawString(margin, y_position, f"{i}. {passenger['name']}")
            y_position -= 20
            c.drawString(margin + cm, y_position, f"رقم الهوية: {passenger['id_number']}")
            y_position -= 20
            c.drawString(margin + cm, y_position, f"الجنسية: {passenger['nationality']}")
            y_position -= 30

        # Save the PDF
        c.save()
        logger.info(f"PDF generated successfully at {output_path}")

        # Verify file exists and has content
        if not Path(output_path).exists():
            raise FileNotFoundError(f"PDF file not found at {output_path}")

        if Path(output_path).stat().st_size == 0:
            raise ValueError(f"Generated PDF is empty at {output_path}")

        return Path(output_path).name

    except Exception as e:
        logger.error(f"Error in PDF generation process: {str(e)}")
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