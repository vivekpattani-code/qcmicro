libs = ['reportlab', 'fpdf', 'fpdf2', 'matplotlib', 'pdfkit', 'weasyprint', 'PIL']
for lib in libs:
    try:
        __import__(lib)
        print(f"{lib}: AVAILABLE")
    except ImportError:
        print(f"{lib}: NOT AVAILABLE")
