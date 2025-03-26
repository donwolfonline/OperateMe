import sys
import json
import logging
from pathlib import Path
import qrcode
from io import BytesIO
import base64
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import black, white
from reportlab.lib.units import cm
import fitz  # PyMuPDF
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_replit_url():
    """Get the correct Replit URL for the current environment"""
    try:
        if os.getenv('NODE_ENV') == 'production':
            return "https://operit.replit.app"
        return "http://localhost:5000"
    except Exception as e:
        logger.error(f"Error getting Replit URL: {str(e)}")
        return "http://localhost:5000"

def generate_qr_code(pdf_filename):
    """Generate QR code for the PDF"""
    try:
        base_url = get_replit_url()
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

def create_pdf_with_reportlab(data, qr_code_bytes, temp_path):
    """Create PDF using ReportLab"""
    try:
        # Create the PDF
        c = canvas.Canvas(str(temp_path), pagesize=A4)  # Convert Path to string
        width, height = A4

        # Add QR code
        c.drawImage(BytesIO(qr_code_bytes), 50, height - 100, width=80, height=80)

        # Add content
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width/2, height - 100, "عقد نقل على الطرق البرية")

        # Set font for Arabic text
        c.setFont("Helvetica", 12)
        y_position = height - 150

        # Add trip information
        c.drawString(100, y_position, f"التاريخ: {data['date']}")
        y_position -= 30

        c.drawString(100, y_position, f"من: {data['from_city']}")
        y_position -= 30

        c.drawString(100, y_position, f"إلى: {data['to_city']}")
        y_position -= 30

        # Driver information
        y_position -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(100, y_position, "معلومات السائق / Driver Information")
        c.setFont("Helvetica", 12)
        y_position -= 30

        c.drawString(100, y_position, f"اسم السائق / Driver Name: {data['driver_name']}")
        y_position -= 30

        c.drawString(100, y_position, f"رقم الهوية / ID Number: {data['driver_id']}")
        y_position -= 30

        c.drawString(100, y_position, f"رقم الرخصة / License Number: {data['license_number']}")
        y_position -= 30

        # Passenger information
        y_position -= 20
        c.setFont("Helvetica-Bold", 14)
        c.drawString(100, y_position, "معلومات الركاب / Passenger Information")
        c.setFont("Helvetica", 12)
        y_position -= 30

        for i, passenger in enumerate(data['passengers'], 1):
            c.drawString(100, y_position, f"{i}. {passenger['name']}")
            y_position -= 20
            c.drawString(120, y_position, f"رقم الهوية / ID: {passenger['id_number']}")
            y_position -= 20
            c.drawString(120, y_position, f"الجنسية / Nationality: {passenger['nationality']}")
            y_position -= 30

        c.save()
        logger.info(f"Basic PDF created at: {temp_path}")
        return True
    except Exception as e:
        logger.error(f"Error creating PDF with ReportLab: {str(e)}")
        raise

def add_background_with_pymupdf(temp_path, output_path):
    """Add background to PDF using PyMuPDF"""
    try:
        # Get background image path
        bg_image_path = Path(__file__).parent.parent.parent / 'attached_assets' / 'Screenshot 2025-03-26 at 8.03.07 AM.png'

        if not bg_image_path.exists():
            logger.error(f"Background image not found at {bg_image_path}")
            raise FileNotFoundError(f"Background image not found at {bg_image_path}")

        logger.info(f"Using background image from: {bg_image_path}")

        # Open the PDF
        pdf_doc = fitz.open(str(temp_path))  # Convert Path to string

        # Add background to each page
        for page in pdf_doc:
            # Insert background image
            page.insert_image(
                page.rect,  # Use full page rectangle
                filename=str(bg_image_path),
                keep_proportion=True,
                overlay=False  # Place image behind content
            )

        # Save the result
        pdf_doc.save(str(output_path))  # Convert Path to string
        pdf_doc.close()

        # Remove temporary file
        os.unlink(temp_path)

        logger.info(f"Final PDF saved at: {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error adding background with PyMuPDF: {str(e)}")
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

        # Create temporary path for intermediate PDF
        temp_path = output_path + '.temp'
        logger.info(f"Will create temporary PDF at: {temp_path}")

        # Create PDF with ReportLab
        create_pdf_with_reportlab(data, qr_code_bytes, temp_path)
        logger.info("Basic PDF created with ReportLab")

        # Add background with PyMuPDF
        add_background_with_pymupdf(temp_path, output_path)
        logger.info("Background added with PyMuPDF")

        # Verify the final PDF exists and has content
        if not os.path.exists(output_path):
            raise FileNotFoundError(f"Final PDF not found at {output_path}")

        if os.path.getsize(output_path) == 0:
            raise ValueError(f"Final PDF is empty at {output_path}")

        logger.info(f"PDF generation completed successfully. File: {output_path}, Size: {os.path.getsize(output_path)} bytes")
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