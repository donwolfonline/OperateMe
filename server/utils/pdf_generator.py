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
            return "https://operit.replit.app"
        replit_domain = os.getenv('REPLIT_DOMAIN')
        repl_id = os.getenv('REPL_ID')
        repl_slug = os.getenv('REPL_SLUG')
        if replit_domain:
            return f"https://{replit_domain}"
        elif repl_slug and repl_id:
            return f"https://{repl_slug}.id.repl.co"
        return "http://localhost:5000"
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

def render_hyundai_staria_pdf(env, data, qr_code_base64, output_path):
    """Generate PDF specifically for Hyundai Staria"""
    try:
        template = env.get_template('hyundai_staria_contract.html')
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

        # Add more detailed logging
        logger.info("Checking company name in rendered HTML...")
        expected_company = "شركة صاعقة الطريق للنقل البري (شخص واحد)"
        if expected_company not in html_content:
            logger.error(f"Company name verification failed. Expected: {expected_company}")
            raise ValueError("Hyundai Staria template verification failed - missing required company name")
        else:
            logger.info("Company name verification passed")

        font_config = FontConfiguration()
        HTML(string=html_content).write_pdf(output_path, font_config=font_config)
        logger.info("Generated Hyundai Staria contract with correct company name")
    except Exception as e:
        logger.error(f"Error in Hyundai Staria PDF generation: {str(e)}")
        raise

def render_gmc_chevrolet_pdf(env, data, qr_code_base64, output_path):
    """Generate PDF for GMC/Chevrolet"""
    try:
        template = env.get_template('gmc_chevrolet_contract.html')
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

        # Verify company name
        if "شركة النجمة الفارهة للنقل البري" not in html_content:
            raise ValueError("GMC/Chevrolet template verification failed - missing required company name")

        font_config = FontConfiguration()
        HTML(string=html_content).write_pdf(output_path, font_config=font_config)
        logger.info("Generated GMC/Chevrolet contract with correct company name")
    except Exception as e:
        logger.error(f"Error in GMC/Chevrolet PDF generation: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    try:
        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Get vehicle info
        vehicle_type = (data.get('vehicle_type') or '').lower().strip()
        vehicle_model = (data.get('vehicle_model') or '').lower().strip()

        logger.info(f"Processing PDF generation for vehicle: type={vehicle_type}, model={vehicle_model}")

        # Generate QR code
        pdf_filename = Path(output_path).name
        qr_code_base64 = generate_qr_code(pdf_filename)

        # Setup Jinja2 environment
        template_dir = Path(__file__).parent / 'pdf_templates'
        logger.info(f"Loading templates from: {template_dir}")
        env = Environment(loader=FileSystemLoader(template_dir))

        # Use specific template based on vehicle type
        if vehicle_type == 'hyundai' and vehicle_model == 'staria':
            logger.info("Using Hyundai Staria specific template")
            render_hyundai_staria_pdf(env, data, qr_code_base64, output_path)
        else:
            logger.info("Using GMC/Chevrolet template")
            render_gmc_chevrolet_pdf(env, data, qr_code_base64, output_path)

        logger.info(f"PDF generation completed successfully: {output_path}")
        return pdf_filename

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