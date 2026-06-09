with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Find references to module numbers and titles
matches = re.finditer(r'(Module\s*[45]|Equipment|Label)', content, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 60)
    end = min(len(content), m.end() + 60)
    snippet = content[start:end].replace('\n', ' ')
    if any(w in snippet.lower() for w in ["equipment", "safety", "label", "analysis"]):
        print(f"Line approx context: {snippet}")
