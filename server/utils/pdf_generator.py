import sys
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
import arabic_reshaper
from bidi.algorithm import get_display
import os
import qrcode
from io import BytesIO

def reshape_arabic(text):
    """Reshape Arabic text for proper rendering"""
    try:
        reshaped_text = arabic_reshaper.reshape(str(text))
        return get_display(reshaped_text)
    except:
        return text

def generate_pdf(data_path, output_path):
    """Generate PDF with proper Arabic text rendering"""
    # Load data
    with open(data_path, 'r') as f:
        data = json.load(f)

    # Create PDF
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Set default font
    c.setFont('Helvetica-Bold', 16)

    # Title
    title = reshape_arabic("عقد نقل على الطرق البرية")
    title_width = c.stringWidth(title, 'Helvetica-Bold', 16)
    c.drawString(width/2 - title_width/2, height - 50, title)

    # Contract agreement text
    y_pos = height - 100
    c.setFont('Helvetica', 10)

    agreement_text = [
        "تم ابرام هذا العقد بين المتعاقدين بناء على المادة (39) التاسعة و الثلاثون من اللائحة المنظمة لنشاط النقل المتخصص و تأجير و توجيه الحافلات",
        "و بناء على الفقرة (1) من المادة (39) و التي تنص على ان يجب على الناقل ابرام عقد نقل مع الاطراف المحددين في المادة (40) قبل تنفيذ عمليات النقل على الطرق البرية",
        "",
        "الطرف الاول : شركة صاعقة الطريق للنقل البري (شخص واحد)",
        f"الطرف الثاني : {data['main_passenger']}"
    ]

    for line in agreement_text:
        if line:
            reshaped_line = reshape_arabic(line)
            text_width = c.stringWidth(reshaped_line, 'Helvetica', 10)
            c.drawString(width - 50 - text_width, y_pos, reshaped_line)
        y_pos -= 20

    def draw_info_box(title, content, y_start, box_height=None):
        if not box_height:
            box_height = len(content) * 20 + 40

        # Draw box
        box_width = width - 100
        c.rect(50, y_start - box_height, box_width, box_height)

        # Draw grey header
        c.setFillColor(colors.lightgrey)
        c.rect(50, y_start - 30, box_width, 30, fill=1)
        c.setFillColor(colors.black)

        # Draw title
        c.setFont('Helvetica-Bold', 12)
        reshaped_title = reshape_arabic(title)
        title_width = c.stringWidth(reshaped_title, 'Helvetica-Bold', 12)
        c.drawString(width - 60 - title_width, y_start - 20, reshaped_title)

        # Draw content
        c.setFont('Helvetica', 10)
        content_y = y_start - 50
        for line in content:
            reshaped_line = reshape_arabic(line)
            text_width = c.stringWidth(reshaped_line, 'Helvetica', 10)
            c.drawString(width - 60 - text_width, content_y, reshaped_line)
            content_y -= 20

        return y_start - box_height - 10

    # Trip Information
    y_pos = height - 250
    trip_info = [
        f"التاريخ / Date: {data['date']}",
        f"من / From: {data['from_city']}",
        f"إلى / To: {data['to_city']}",
        f"نوع التأشيرة / Visa Type: {data['visa_type']}",
        f"رقم الرحلة / Trip No.: {data['trip_number']}"
    ]
    y_pos = draw_info_box("معلومات الرحلة / Trip Information", trip_info, y_pos, 120)

    # Driver Information
    driver_info = [
        f"اسم السائق / Driver Name: {data['driver_name']}",
        f"رقم الهوية / ID Number: {data['driver_id']}",
        f"رقم الرخصة / License Number: {data['license_number']}"
    ]
    y_pos = draw_info_box("معلومات السائق / Driver Information", driver_info, y_pos, 100)

    # Passenger Information
    passenger_info = []
    for i, passenger in enumerate(data['passengers'], 1):
        passenger_info.extend([
            f"{i}. {passenger['name']}",
            f"رقم الهوية / ID: {passenger['id_number']}",
            f"الجنسية / Nationality: {passenger['nationality']}"
        ])

    box_height = min(200, len(passenger_info) * 20 + 40)
    y_pos = draw_info_box("معلومات الركاب / Passenger Information", passenger_info, y_pos, box_height)

    # Add QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr_data = f"Order: {data['trip_number']}, From: {data['from_city']}, To: {data['to_city']}"
    qr.add_data(qr_data)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="black", back_color="white")

    qr_buffer = BytesIO()
    qr_img.save(qr_buffer)
    qr_buffer.seek(0)

    c.drawImage(qr_buffer, 50, y_pos - 100, width=100, height=100)

    # Save PDF
    c.save()
    return os.path.basename(output_path)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python pdf_generator.py <data_path> <output_path>")
        sys.exit(1)

    data_path = sys.argv[1]
    output_path = sys.argv[2]
    generate_pdf(data_path, output_path)