import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find any occurrences of "preQuiz" or "postQuiz" or "quiz" and print lines containing them
for line_num, line in enumerate(content.split('\n'), 1):
    if "prequiz" in line.lower() or "postquiz" in line.lower():
        if "{" in line or "=" in line or ":" in line:
            print(f"{line_num}: {line.strip()[:100]}")
