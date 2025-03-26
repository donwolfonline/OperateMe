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

def get_replit_url():
    """Get the correct Replit URL for the current environment"""
    try:
        # In production, always use operit.replit.app
        if os.getenv('NODE_ENV') == 'production':
            base_url = "https://operit.replit.app"
            logger.info(f"Using production URL: {base_url}")
            return base_url

        # For development, try different options
        replit_domain = os.getenv('REPLIT_DOMAIN')
        repl_id = os.getenv('REPL_ID')
        repl_slug = os.getenv('REPL_SLUG')

        if replit_domain:
            base_url = f"https://{replit_domain}"
        elif repl_slug and repl_id:
            base_url = f"https://{repl_slug}.id.repl.co"
        else:
            base_url = "http://localhost:5000"

        logger.info(f"Using development URL: {base_url}")
        return base_url
    except Exception as e:
        logger.error(f"Error getting Replit URL: {str(e)}")
        return "http://localhost:5000"

def generate_qr_code(pdf_filename):
    """Generate QR code and return as base64 string"""
    try:
        base_url = get_replit_url()
        pdf_url = f"{base_url}/uploads/{pdf_filename}"
        logger.info(f"Generated PDF URL for QR: {pdf_url}")

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(pdf_url)
        qr.make(fit=True)
        qr_img = qr.make_image(fill_color="black", back_color="white")

        buffer = BytesIO()
        qr_img.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        logger.info(f"Successfully generated QR code for URL: {pdf_url}")
        return f"data:image/png;base64,{qr_base64}"
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise

def select_template(vehicle_type, vehicle_model):
    """Select the appropriate template based on vehicle type and model"""
    vehicle_type = (vehicle_type or '').lower()
    vehicle_model = (vehicle_model or '').lower()

    logger.info(f"Selecting template for vehicle type: {vehicle_type}, model: {vehicle_model}")

    # Explicit check for Hyundai Staria
    if vehicle_type == 'hyundai' and vehicle_model == 'staria':
        template_name = 'hyundai_contract.html'
        logger.info("Selected Hyundai Staria template")
    else:
        template_name = 'gmc_contract.html'
        logger.info("Selected GMC/Chevrolet template")

    return template_name

def verify_template_content(template_name, html_content):
    """Verify the template content matches the expected company name"""
    expected_company = None
    if template_name == 'hyundai_contract.html':
        expected_company = "شركة صاعقة الطريق للنقل البري"
        if expected_company not in html_content:
            logger.error("Hyundai template does not contain correct company name!")
    else:
        expected_company = "شركة النجمة الفارهة للنقل البري"
        if expected_company not in html_content:
            logger.error("GMC template does not contain correct company name!")

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering using WeasyPrint"""
    try:
        logger.info(f"Starting PDF generation. Data path: {data_path}, Output path: {output_path}")

        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Get the PDF filename
        pdf_filename = Path(output_path).name
        logger.info(f"PDF filename: {pdf_filename}")

        # Generate QR code with the PDF filename
        qr_code_base64 = generate_qr_code(pdf_filename)

        # Set up Jinja2 environment
        template_dir = Path(__file__).parent / 'pdf_templates'
        env = Environment(loader=FileSystemLoader(template_dir))

        # Select template based on vehicle type and model
        template_name = select_template(data.get('vehicle_type'), data.get('vehicle_model'))
        logger.info(f"Using template: {template_name}")

        template = env.get_template(template_name)

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

        # Verify template content
        verify_template_content(template_name, html_content)

        # Configure fonts
        font_config = FontConfiguration()

        # Generate PDF
        HTML(string=html_content).write_pdf(
            output_path,
            font_config=font_config
        )

        logger.info(f"PDF saved successfully at: {output_path}")
        return pdf_filename

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