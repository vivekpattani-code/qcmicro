with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
for i, line in enumerate(lines):
    if 'id="viewport-sterility"' in line:
        start = i
        break

if start != -1:
    print(f"viewport-sterility starts at line {start+1}")
    for idx in range(start, min(len(lines), start + 120)):
        print(f"{idx+1}: {lines[idx].strip()}")
else:
    print("viewport-sterility not found")
