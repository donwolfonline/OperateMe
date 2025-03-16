import sys
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import arabic_reshaper
from bidi.algorithm import get_display
import os

def reshape_arabic(text):
    """Reshape Arabic text for proper rendering"""
    try:
        reshaped_text = arabic_reshaper.reshape(str(text))
        return get_display(reshaped_text)
    except:
        return text

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering"""
    # Load data from JSON file
    with open(data_path, 'r') as f:
        data = json.load(f)

    # Initialize PDF
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Set initial position
    current_y = height - 50

    # Title
    title = reshape_arabic("عقد نقل على الطرق البرية")
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width/2, current_y, title)
    current_y -= 40

    # Draw agreement text
    c.setFont("Helvetica", 10)
    agreement_text = [
        reshape_arabic("تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات"),
        reshape_arabic("و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية"),
        "",
        reshape_arabic("الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)"),
        reshape_arabic(f"الطرف الثاني : {data['main_passenger']}")
    ]

    for line in agreement_text:
        if line:
            text_width = c.stringWidth(line, "Helvetica", 10)
            x_position = width - 50 - text_width
            c.drawString(x_position, current_y, line)
            current_y -= 20
        else:
            current_y -= 10

    current_y -= 20

    def draw_section(title, content, height):
        nonlocal current_y

        # Draw box
        c.rect(50, current_y - height, width - 100, height)

        # Draw grey header
        c.setFillColor(colors.lightgrey)
        c.rect(50, current_y - 20, width - 100, 20, fill=1)
        c.setFillColor(colors.black)

        # Draw title
        c.setFont("Helvetica-Bold", 11)
        title_text = reshape_arabic(title)
        title_width = c.stringWidth(title_text, "Helvetica-Bold", 11)
        c.drawString(width - 60 - title_width, current_y - 15, title_text)

        # Draw content
        c.setFont("Helvetica", 10)
        content_y = current_y - 40

        for line in content:
            text = reshape_arabic(line)
            text_width = c.stringWidth(text, "Helvetica", 10)
            c.drawString(width - 60 - text_width, content_y, text)
            content_y -= 20

        current_y -= (height + 20)

    # Trip Information
    trip_content = [
        f"Date / التاريخ: {data['date']}",
        f"From / من: {data['from_city']}",
        f"To / إلى: {data['to_city']}",
        f"Visa Type / نوع التأشيرة: {data['visa_type']}",
        f"Trip No. / رقم الرحلة: {data['trip_number']}"
    ]
    draw_section("Trip Information / معلومات الرحلة", trip_content, 120)

    # Driver Information
    driver_content = [
        f"Driver Name / اسم السائق: {data['driver_name']}",
        f"ID Number / رقم الهوية: {data['driver_id']}",
        f"License Number / رقم الرخصة: {data['license_number']}"
    ]
    draw_section("Driver Information / معلومات السائق", driver_content, 80)

    # Passenger Information
    passenger_content = []
    for i, passenger in enumerate(data['passengers'], 1):
        passenger_content.extend([
            f"{i}. {passenger['name']}",
            f"ID / رقم الهوية: {passenger['id_number']}",
            f"Nationality / الجنسية: {passenger['nationality']}"
        ])
    passenger_height = min(200, len(passenger_content) * 20 + 30)
    draw_section("Passenger Information / معلومات الركاب", passenger_content, passenger_height)

    c.save()
    return os.path.basename(output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    data_path = sys.argv[1]
    output_path = sys.argv[2]
    generate_pdf(data_path, output_path)