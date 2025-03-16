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
    return get_display(arabic_reshaper.reshape(str(text)))

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering"""
    # Load data from JSON file
    with open(data_path, 'r') as f:
        data = json.load(f)

    # Create PDF
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Set title
    title = reshape_arabic("عقد نقل على الطرق البرية")
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 50, title)

    # Draw contract text
    contract_text = [
        reshape_arabic("تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات"),
        reshape_arabic("و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية"),
        "",
        reshape_arabic("الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)"),
        reshape_arabic(f"الطرف الثاني : {data['main_passenger']}")
    ]

    y_position = height - 100
    c.setFont("Helvetica", 10)
    for line in contract_text:
        if line:
            c.drawRightString(width - 50, y_position, line)
        y_position -= 20

    # Helper function to create info box
    def create_info_box(title, content, y_pos, box_height):
        # Draw box
        c.rect(50, y_pos - box_height, width - 100, box_height)

        # Draw grey header background
        c.setFillColor(colors.lightgrey)
        c.rect(50, y_pos - 25, width - 100, 25, fill=1)
        c.setFillColor(colors.black)

        # Draw title
        c.setFont("Helvetica-Bold", 12)
        c.drawString(60, y_pos - 20, reshape_arabic(title))

        # Draw content
        c.setFont("Helvetica", 10)
        content_y = y_pos - 45
        for line in content:
            c.drawRightString(width - 60, content_y, reshape_arabic(line))
            content_y -= 20

        return y_pos - box_height - 10

    # Trip Information Box
    y_pos = height - 250
    trip_content = [
        f"Date / التاريخ: {data['date']}",
        f"From / من: {data['from_city']}",
        f"To / إلى: {data['to_city']}",
        f"Visa Type / نوع التأشيرة: {data['visa_type']}",
        f"Trip No. / رقم الرحلة: {data['trip_number']}"
    ]
    y_pos = create_info_box("Trip Information / معلومات الرحلة", trip_content, y_pos, 130)

    # Driver Information Box
    driver_content = [
        f"Driver Name / اسم السائق: {data['driver_name']}",
        f"ID Number / رقم الهوية: {data['driver_id']}",
        f"License Number / رقم الرخصة: {data['license_number']}"
    ]
    y_pos = create_info_box("Driver Information / معلومات السائق", driver_content, y_pos, 100)

    # Passenger Information Box
    passenger_content = []
    for i, passenger in enumerate(data['passengers'], 1):
        passenger_content.extend([
            f"{i}. {passenger['name']}",
            f"   ID / رقم الهوية: {passenger['id_number']}",
            f"   Nationality / الجنسية: {passenger['nationality']}"
        ])

    box_height = min(200, len(passenger_content) * 20 + 35)
    y_pos = create_info_box("Passenger Information / معلومات الركاب", passenger_content, y_pos, box_height)

    # Save the PDF
    c.save()
    return os.path.basename(output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    data_path = sys.argv[1]
    output_path = sys.argv[2]
    generate_pdf(data_path, output_path)