import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('js/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

def count_questions(object_name):
    print(f"=== {object_name} ===")
    start_idx = content.find(object_name)
    if start_idx == -1:
        print("Not found")
        return
    
    pos = start_idx + len(object_name)
    while pos < len(content) and content[pos] != '{':
        pos += 1
    
    brace_count = 1
    pos += 1
    block_chars = ['{']
    in_str = False
    str_char = ''
    while pos < len(content) and brace_count > 0:
        c = content[pos]
        block_chars.append(c)
        if in_str:
            if c == str_char and content[pos-1] != '\\':
                in_str = False
        else:
            if c in ['"', "'", '`']:
                in_str = True
                str_char = c
            elif c == '{':
                brace_count += 1
            elif c == '}':
                brace_count -= 1
        pos += 1
    block = "".join(block_chars)
    
    for k in range(1, 8):
        # Find key k inside block
        m = re.search(r'\b' + str(k) + r'\s*:\s*\[', block)
        if m:
            start_q_pos = m.end()
            # find matching bracket ]
            bracket_count = 1
            idx = start_q_pos
            q_chars = []
            while idx < len(block) and bracket_count > 0:
                char = block[idx]
                q_chars.append(char)
                if char == '[':
                    bracket_count += 1
                elif char == ']':
                    bracket_count -= 1
                idx += 1
            q_block = "".join(q_chars)
            # count occurrences of "q:" or similar in q_block
            q_matches = re.findall(r'\bq\s*:', q_block)
            print(f"Module {k}: {len(q_matches)} questions")
        else:
            print(f"Module {k}: key not found")

count_questions("this.prequizzes =")
count_questions("this.quizzes =")
