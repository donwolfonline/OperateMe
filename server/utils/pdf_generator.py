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
import shutil

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_template_config(vehicle_type=None):
    """Get template configuration based on vehicle type"""
    try:
        config_path = Path(__file__).parent / 'pdf_templates' / 'config.json'
        with open(config_path, 'r') as f:
            config = json.load(f)

        # Select template based on vehicle type
        template_key = 'default'
        if vehicle_type:
            vehicle_type = vehicle_type.lower().replace(' ', '_')
            if vehicle_type in config['templates']:
                template_key = vehicle_type

        return config['templates'][template_key]
    except Exception as e:
        logger.error(f"Error loading template config: {str(e)}")
        return {
            'background': 'lightning_road_bg.png',
            'size': 'A4',
            'margin': '1.5cm',
            'opacity': '0.92',
            'scale': '95%'
        }

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

def setup_template_assets(vehicle_type=None):
    """Setup template assets including background image"""
    try:
        template_dir = Path(__file__).parent / 'pdf_templates'
        template_dir.mkdir(parents=True, exist_ok=True)

        # Get template configuration
        template_config = get_template_config(vehicle_type)

        # Define background image paths
        bg_image_source = Path(__file__).parent.parent.parent / 'attached_assets' / 'Screenshot 2025-03-26 at 8.03.07 AM.png'
        bg_image_dest = template_dir / 'lightning_road_bg.png'

        logger.info(f"Looking for background image at: {bg_image_source}")
        logger.info(f"Will copy to: {bg_image_dest}")

        # Copy background image if it exists
        if bg_image_source.exists():
            shutil.copy(bg_image_source, bg_image_dest)
            logger.info(f"Background image copied successfully to {bg_image_dest}")
        else:
            # Fallback to checking for existing background
            if not bg_image_dest.exists():
                logger.error("No background image found")
                raise FileNotFoundError("No background image found")
            else:
                logger.info("Using existing background image")

        return template_dir, template_config
    except Exception as e:
        logger.error(f"Error setting up template assets: {str(e)}")
        raise

def render_pdf(data, qr_code_base64, output_path):
    """Generate PDF using the template"""
    try:
        # Get vehicle type from data if available
        vehicle_type = data.get('vehicle_type', '').lower() if data.get('vehicle_type') else None

        logger.info(f"Starting PDF generation for vehicle type: {vehicle_type}")
        template_dir, template_config = setup_template_assets(vehicle_type)

        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template('transport_contract.html')

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
            qr_code=qr_code_base64,
            template_config=template_config
        )

        font_config = FontConfiguration()
        css_string = CSS(string=f'''
            @page {{
                size: {template_config['size']};
                margin: {template_config['margin']};
                @bottom-right {{
                    content: counter(page);
                }}
            }}
            body {{
                font-family: 'Arial', sans-serif;
                background-image: url('{template_config["background"]}');
                background-position: center;
                background-repeat: no-repeat;
                background-size: {template_config["scale"]};
                background-attachment: fixed;
            }}
            .content-wrapper {{
                background-color: rgba(255, 255, 255, {template_config["opacity"]});
            }}
        ''')

        # Create PDF with background image and custom CSS
        HTML(
            string=html_content,
            base_url=str(template_dir)
        ).write_pdf(
            output_path,
            font_config=font_config,
            stylesheets=[css_string],
            presentational_hints=True
        )

        logger.info(f"Generated PDF successfully at {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error in PDF generation: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    try:
        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        logger.info("Data loaded successfully")

        # Generate QR code
        pdf_filename = Path(output_path).name
        qr_code_base64 = generate_qr_code(pdf_filename)
        logger.info("QR code generated successfully")

        # Generate PDF
        success = render_pdf(data, qr_code_base64, output_path)
        if success:
            logger.info(f"PDF generation completed successfully: {output_path}")
            return pdf_filename
        else:
            raise Exception("PDF generation failed")

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