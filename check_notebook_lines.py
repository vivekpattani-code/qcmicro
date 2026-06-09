with open('js/notebook.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "recalculateScore()" in line or "checkCertificateStatus()" in line:
            print(f"Line {i}: {line.strip()}")
