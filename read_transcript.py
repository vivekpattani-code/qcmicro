import json
import os

transcript_path = r"C:\Users\vivek\.gemini\antigravity\brain\6f6c5b9d-f589-4d66-9f2e-311ac7baf9a4\.system_generated\logs\transcript.jsonl"

if os.path.exists(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                step = json.loads(line)
                if step.get('type') == 'USER_INPUT':
                    print(f"USER: {step.get('content')}")
                elif step.get('type') == 'PLANNER_RESPONSE':
                    # Only print if it's a response
                    pass
            except Exception as e:
                pass
else:
    print("Transcript not found at", transcript_path)
