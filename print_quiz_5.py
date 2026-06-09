import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find the quizzes block
quizzes_block = content[content.find('this.quizzes ='):]
# Find the start of 5: [ and end of ] inside quizzes_block
q5_match = re.search(r'5:\s*\[([\s\S]*?)\]\s*,\s*6:', quizzes_block)
if q5_match:
    block = q5_match.group(1)
    questions = re.findall(r'q:\s*["\'`]([^"\'`]+)["\'`]', block)
    for idx, q in enumerate(questions, 1):
        print(f"Q{idx}: {q}")
else:
    print("Could not find quizzes for module 5")
