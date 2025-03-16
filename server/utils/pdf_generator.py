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

    # Draw main contract text
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

    # Trip Information Box
    trip_data = [
        [reshape_arabic("معلومات الرحلة / Trip Information")],
        [reshape_arabic(f"التاريخ / Date: {data['date']}")],
        [reshape_arabic(f"من / From: {data['from_city']}")],
        [reshape_arabic(f"إلى / To: {data['to_city']}")],
        [reshape_arabic(f"نوع التأشيرة / Visa Type: {data['visa_type']}")],
        [reshape_arabic(f"رقم الرحلة / Trip No.: {data['trip_number']}")]
    ]

    table = Table(trip_data, colWidths=[width - 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    table.wrapOn(c, width, height)
    table.drawOn(c, 50, height - 300)

    # Driver Information Box
    driver_data = [
        [reshape_arabic("معلومات السائق / Driver Information")],
        [reshape_arabic(f"اسم السائق / Driver Name: {data['driver_name']}")],
        [reshape_arabic(f"رقم الهوية / ID Number: {data['driver_id']}")],
        [reshape_arabic(f"رقم الرخصة / License Number: {data['license_number']}")]
    ]

    driver_table = Table(driver_data, colWidths=[width - 100])
    driver_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    driver_table.wrapOn(c, width, height)
    driver_table.drawOn(c, 50, height - 450)

    # Passengers Information Box
    passenger_data = [[reshape_arabic("معلومات الركاب / Passenger Information")]]
    for i, passenger in enumerate(data['passengers'], 1):
        passenger_data.extend([
            [reshape_arabic(f"{i}. {passenger['name']}")],
            [reshape_arabic(f"   رقم الهوية / ID: {passenger['id_number']}")],
            [reshape_arabic(f"   الجنسية / Nationality: {passenger['nationality']}")]
        ])

    passenger_table = Table(passenger_data, colWidths=[width - 100])
    passenger_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    passenger_table.wrapOn(c, width, height)
    passenger_table.drawOn(c, 50, height - 650)

    c.save()
    return os.path.basename(output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    data_path = sys.argv[1]
    output_path = sys.argv[2]
    generate_pdf(data_path, output_path)