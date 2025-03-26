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
        return config['templates']['default']

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

def setup_template_assets(vehicle_type=None):
    """Setup template assets including background image"""
    try:
        template_dir = Path(__file__).parent / 'pdf_templates'
        template_dir.mkdir(parents=True, exist_ok=True)

        # Get template configuration
        template_config = get_template_config(vehicle_type)

        # Define background image paths
        bg_image_source = Path(__file__).parent.parent.parent / 'attached_assets' / template_config['background']
        bg_image_dest = template_dir / template_config['background']

        # Copy background image if it exists
        if bg_image_source.exists():
            shutil.copy(bg_image_source, bg_image_dest)
            logger.info(f"Background image copied successfully to {bg_image_dest}")
        else:
            # Fallback to default background if specific one not found
            default_bg = Path(__file__).parent.parent.parent / 'attached_assets' / 'Screenshot 2025-03-26 at 8.03.07 AM.png'
            if default_bg.exists():
                shutil.copy(default_bg, template_dir / 'lightning_road_bg.png')
                template_config['background'] = 'lightning_road_bg.png'
                logger.info("Using default background image")
            else:
                logger.error("No background image found")
                raise FileNotFoundError("No background image found")

        return template_dir, template_config
    except Exception as e:
        logger.error(f"Error setting up template assets: {str(e)}")
        raise

def render_pdf(data, qr_code_base64, output_path):
    """Generate PDF using the template based on vehicle type"""
    try:
        # Get vehicle type from data if available
        vehicle_type = data.get('vehicle_type', '').lower() if data.get('vehicle_type') else None

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

        logger.info(f"Generated transport contract successfully at {output_path}")
    except Exception as e:
        logger.error(f"Error in PDF generation: {str(e)}")
        raise

def generate_pdf(data_path, output_path):
    try:
        # Load data
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Generate QR code
        pdf_filename = Path(output_path).name
        qr_code_base64 = generate_qr_code(pdf_filename)

        # Generate PDF
        render_pdf(data, qr_code_base64, output_path)
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