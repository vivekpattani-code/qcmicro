with open('js/app.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1480, 1560):
    if i < len(lines):
        print(f"{i+1}: {lines[i]}", end='')
