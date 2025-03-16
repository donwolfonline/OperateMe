import sys
import json
import logging
from pathlib import Path
import qrcode
from io import BytesIO
import base64
from jinja2 import Template, FileSystemLoader, Environment
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration
import os

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

def generate_qr_code(data):
    """Generate QR code and return as base64 string"""
    try:
        # Get base URL from environment or use default
        base_url = os.getenv('BASE_URL', 'https://vehicle-management.replit.app')

        # Create a full URL to the PDF
        pdf_url = f"{base_url}/uploads/{data['filename']}"
        logger.info(f"Generated PDF URL for QR: {pdf_url}")

        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(pdf_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        buffer = BytesIO()
        qr_img.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        return f"data:image/png;base64,{qr_base64}"
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering using WeasyPrint"""
    try:
        logger.info(f"Starting PDF generation. Data path: {data_path}, Output path: {output_path}")

        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Add filename to data for QR code generation
        data['filename'] = Path(output_path).name

        # Set up Jinja2 environment
        template_dir = Path(__file__).parent / 'pdf_templates'
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('transport_contract.html')

        # Generate QR code
        qr_code_base64 = generate_qr_code(data)

        # Render template
        html_content = template.render(
            main_passenger=data['main_passenger'],
            date=data['date'],
            from_city=data['from_city'],
            to_city=data['to_city'],
            visa_type=data['visa_type'],
            trip_number=data['trip_number'],
            driver_name=data['driver_name'],
            driver_id=data['driver_id'],
            license_number=data['license_number'],
            passengers=data['passengers'],
            qr_code=qr_code_base64
        )

        # Configure fonts
        font_config = FontConfiguration()

        # Generate PDF
        HTML(string=html_content).write_pdf(
            output_path,
            font_config=font_config
        )

        logger.info(f"PDF saved successfully at: {output_path}")
        return Path(output_path).name

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

import arabic_reshaper
from bidi.algorithm import get_display
from PIL import Image