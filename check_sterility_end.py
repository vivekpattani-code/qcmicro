with open('js/modules/sterility.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")
for idx in range(max(0, len(lines)-60), len(lines)):
    print(f"{idx+1}: {lines[idx].strip()}")
