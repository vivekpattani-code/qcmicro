with open('js/modules/sterility.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "class SterilityModule" in line or "init(" in line or "switchMode(" in line or "setupSteps(" in line or "export const" in line:
            print(f"Line {i}: {line.strip()}")
