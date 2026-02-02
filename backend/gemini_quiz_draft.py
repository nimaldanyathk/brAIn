def generate_quiz(topic_id: str, context: dict) -> str:
    """
    Generates a personalized quiz for the student based on the topic.
    Returns a JSON list of Question objects.
    """
    if not API_KEY:
        return _get_mock_quiz(topic_id)

    model = genai.GenerativeModel('gemini-flash-latest')
    
    prompt = f"""
    You are an expert examiner for a STEM training program.
    Generate a short, 3-question adaptive quiz for the topic: "{topic_id}".
    
    Student Context: {context}
    
    DIRECTIVES:
    1. Questions should check for conceptual understanding, not just rote memorization.
    2. If the student has high mastery, make it harder.
    3. Include 4 options for each question.
    4. Provide a brief explanation for the correct answer.
    
    OUTPUT FORMAT (JSON List):
    [
        {{
            "id": 1,
            "text": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // Index of correct option (0-3)
            "explanation": "Why this is correct."
        }}
    ]
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return text
    except Exception as e:
        print(f"Quiz Gen Error: {e}")
        return _get_mock_quiz(topic_id)

def _get_mock_quiz(topic_id: str) -> str:
    # ... mock data ...
    return json.dumps([
        {
            "id": 1,
            "text": f"What is a key concept in {topic_id}?",
            "options": ["Concept A", "Concept B", "Concept C", "Concept D"],
            "correctAnswer": 0,
            "explanation": "This is a placeholder quiz."
        }
    ])
