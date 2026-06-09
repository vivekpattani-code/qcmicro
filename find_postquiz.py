with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find any functions or object keys matching quiz or assessment
matches = re.finditer(r'(assessment|postQuiz|post_quiz|postquiz)', content, re.IGNORECASE)
found = set()
for m in matches:
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 150)
    snippet = content[start:end].replace('\n', ' ')
    snippet_clean = re.sub(r'\s+', ' ', snippet)
    found.add(snippet_clean[:180])

for s in sorted(list(found)):
    print(s)
