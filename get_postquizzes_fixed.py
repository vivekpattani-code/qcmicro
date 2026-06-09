import re

with open('js/app.js', 'r') as f:
    content = f.read()

# Locate the quizzes object
start_idx = content.find('this.quizzes = {')
if start_idx != -1:
    quizzes_block = content[start_idx:]
    # Extract module 4 quizzes
    match4 = re.search(r'4:\s*\[([\s\S]*?)\]\s*,\s*5:', quizzes_block)
    # Extract module 5 quizzes
    match5 = re.search(r'5:\s*\[([\s\S]*?)\]\s*,\s*6:', quizzes_block)
    if match4:
        print('--- MODULE 4 QUIZ QUESTIONS ---')
        q4s = re.findall(r"q:\s*['\"]([^'\"]+)['\"]", match4.group(1))
        for idx, q in enumerate(q4s, 1):
            print('Q{0}: {1}'.format(idx, q))
    if match5:
        print('\n--- MODULE 5 QUIZ QUESTIONS ---')
        q5s = re.findall(r"q:\s*['\"]([^'\"]+)['\"]", match5.group(1))
        for idx, q in enumerate(q5s, 1):
            print('Q{0}: {1}'.format(idx, q))
else:
    print('Could not find this.quizzes')
