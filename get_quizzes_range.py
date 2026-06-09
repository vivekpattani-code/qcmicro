with open('js/app.js', 'r', encoding='utf-8') as f:
    for i, line in enumerate(f, 1):
        if "this.quizzes =" in line:
            print(f"Line {i}: {line.strip()}")
            break
