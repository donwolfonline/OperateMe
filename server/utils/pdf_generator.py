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
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_replit_url():
    """Get the correct Replit URL for the current environment"""
    try:
        if os.getenv('NODE_ENV') == 'production':
            base_url = "https://operit.replit.app"
            return base_url

        replit_domain = os.getenv('REPLIT_DOMAIN')
        repl_id = os.getenv('REPL_ID')
        repl_slug = os.getenv('REPL_SLUG')

        if replit_domain:
            base_url = f"https://{replit_domain}"
        elif repl_slug and repl_id:
            base_url = f"https://{repl_slug}.id.repl.co"
        else:
            base_url = "http://localhost:5000"

        return base_url
    except Exception as e:
        logger.error(f"Error getting Replit URL: {str(e)}")
        return "http://localhost:5000"

def generate_qr_code(pdf_filename):
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

        buffer = BytesIO()
        qr_img.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()

        return f"data:image/png;base64,{qr_base64}"
    except Exception as e:
        logger.error(f"Error generating QR code: {str(e)}")
        raise

def load_and_verify_template(env, template_name, required_text):
    """Load and verify template contains required text"""
    try:
        template = env.get_template(template_name)
        rendered = template.render(
            date="", main_passenger="", from_city="", to_city="",
            driver_name="", driver_id="", license_number="",
            trip_number="", visa_type="", passengers=[],
            qr_code=""
        )

        if required_text not in rendered:
            raise ValueError(f"Template {template_name} does not contain required company name: {required_text}")

        logger.info(f"Successfully verified template {template_name} contains {required_text}")
        return template
    except Exception as e:
        logger.error(f"Error loading template {template_name}: {str(e)}")
        raise

def select_template(env, vehicle_type, vehicle_model):
    """Select the appropriate template based on vehicle type and model"""
    logger.info(f"Selecting template for vehicle: type={vehicle_type}, model={vehicle_model}")

    # Force lowercase for comparison
    vehicle_type = (vehicle_type or '').lower().strip()
    vehicle_model = (vehicle_model or '').lower().strip()

    is_hyundai_staria = vehicle_type == 'hyundai' and vehicle_model == 'staria'
    logger.info(f"Is Hyundai Staria: {is_hyundai_staria}")

    if is_hyundai_staria:
        logger.info("Using Hyundai Staria template")
        return load_and_verify_template(
            env,
            'hyundai_contract.html',
            'شركة صاعقة الطريق للنقل البري'
        )
    else:
        logger.info("Using GMC/Chevrolet template")
        return load_and_verify_template(
            env,
            'gmc_contract.html',
            'شركة النجمة الفارهة للنقل البري'
        )

def generate_pdf(data_path, output_path):
    try:
        logger.info(f"Starting PDF generation with data from: {data_path}")

        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Log vehicle information
        logger.info(f"Vehicle information received: type={data.get('vehicle_type')}, model={data.get('vehicle_model')}")

        # Get the PDF filename
        pdf_filename = Path(output_path).name

        # Generate QR code
        qr_code_base64 = generate_qr_code(pdf_filename)

        # Setup Jinja2 environment
        template_dir = Path(__file__).parent / 'pdf_templates'
        env = Environment(loader=FileSystemLoader(template_dir))

        # Select and verify template based on vehicle type
        template = select_template(
            env,
            data.get('vehicle_type'),
            data.get('vehicle_model')
        )

        # Render template
        html_content = template.render(
            date=data['date'],
            main_passenger=data['main_passenger'],
            from_city=data['from_city'],
            to_city=data['to_city'],
            driver_name=data['driver_name'],
            driver_id=data['driver_id'],
            license_number=data['license_number'],
            trip_number=data['trip_number'],
            visa_type=data['visa_type'],
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

        logger.info(f"PDF generated successfully at: {output_path}")
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