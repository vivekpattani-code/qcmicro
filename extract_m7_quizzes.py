with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract prequizzes[7] and quizzes[7]
import re
sys_out_enc = 'utf-8'

def find_block(target):
    idx = content.find(target)
    if idx != -1:
        # Find closing bracket ] for the array
        brace_count = 1
        pos = idx + len(target)
        block_chars = []
        while pos < len(content) and brace_count > 0:
            c = content[pos]
            block_chars.append(c)
            if c == '[':
                brace_count += 1
            elif c == ']':
                brace_count -= 1
            pos += 1
        return target + "".join(block_chars)
    return "Not found"

import sys
sys.stdout.reconfigure(encoding='utf-8')
print("=== PREQUIZZES 7 ===")
print(find_block("7: ["))
print("\n=== QUIZZES 7 ===")
# Find the second occurrence of "7: [" which should be in this.quizzes
first_7 = content.find("7: [")
if first_7 != -1:
    second_7 = content.find("7: [", first_7 + 4)
    if second_7 != -1:
        # extract block
        brace_count = 1
        pos = second_7 + 4
        block_chars = ["7: ["]
        while pos < len(content) and brace_count > 0:
            c = content[pos]
            block_chars.append(c)
            if c == '[':
                brace_count += 1
            elif c == ']':
                brace_count -= 1
            pos += 1
        print("".join(block_chars))
