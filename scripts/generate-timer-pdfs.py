"""Localized guides rendered from the website's current content."""
from pathlib import Path
from xml.sax.saxutils import escape
import json
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image

root = Path(__file__).resolve().parent.parent
content = json.loads((root / "scripts/timer-guide-content.json").read_text())
fontdir = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DejaVu", str(fontdir / "DejaVuSans.ttf")))
pdfmetrics.registerFont(TTFont("DejaVuBold", str(fontdir / "DejaVuSans-Bold.ttf")))
pine = colors.HexColor("#142B20")
sage = colors.HexColor("#526D5D")
ink = colors.HexColor("#24372C")
body_style = ParagraphStyle("Body", fontName="DejaVu", fontSize=10.5, leading=15, textColor=ink, spaceAfter=5)
heading = ParagraphStyle("Heading", fontName="DejaVuBold", fontSize=15, leading=19, textColor=pine, spaceBefore=10, spaceAfter=6, keepWithNext=True)
title_style = ParagraphStyle("Title", fontName="DejaVuBold", fontSize=28, leading=34, textColor=pine, spaceAfter=12)
subtitle = ParagraphStyle("Subtitle", fontName="DejaVu", fontSize=12, leading=18, textColor=sage, spaceAfter=12)
small = ParagraphStyle("Small", fontName="DejaVu", fontSize=9, leading=13, textColor=sage, spaceAfter=5)
sequence = ["start", "control", "sets", "settings", "plan", "history", "backup", "sync", "icons", "premium", "support", "ack", "legal"]

def paragraph(txt, style=body_style):
    return Paragraph(escape(txt).replace("–", "-").replace("—", "-"), style)

def footer(canvas, doc):
    w, h = A4
    canvas.setStrokeColor(colors.HexColor("#BCD8BA"))
    canvas.line(18*mm, 16*mm, w-18*mm, 16*mm)
    canvas.setFont("DejaVu", 8)
    canvas.setFillColor(sage)
    canvas.drawString(18*mm, 11*mm, "Timer · Heinz Josef Igelsbacher · 1.0")
    canvas.drawRightString(w-18*mm, 11*mm, str(doc.page))

for lang, c in content.items():
    out = root / f"downloads/PhysioClock_Guide_{lang.upper()}_V1.pdf"
    doc = SimpleDocTemplate(str(out), pagesize=A4, rightMargin=18*mm, leftMargin=18*mm,
                            topMargin=18*mm, bottomMargin=23*mm, title=f"Timer - {c['guide']}",
                            author="Heinz Josef Igelsbacher")
    story = [paragraph("TIMER · iPhone & iPad", small), paragraph(c["home"], title_style), paragraph(c["sub"], subtitle)]
    photo = Image(str(root / "neutral-lake.jpg"), width=146*mm, height=82.2*mm)
    story.extend([photo, Spacer(1, 8*mm), paragraph(c["guide"], heading),
                  paragraph(c["free"]), paragraph(c["optional"], heading), paragraph(c["optionalText"])])
    for key in sequence:
        title, *items = c["pages"][key]
        story.extend([paragraph(title, heading), *[paragraph(item) for item in items]])
    story.extend([paragraph(c["privacy"], heading), paragraph("https://igelsbacher.github.io/physioclock/" + lang + "/datenschutz.html"),
                  paragraph("https://igelsbacher.github.io/physioclock/" + lang + "/")])
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(out)
