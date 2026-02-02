import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_backend():
    print("Testing Backend API...")
    
    # 1. Update Profile (Simulate a quiz result)
    print("\n1. Testing /analyze-interaction...")
    interaction = {
        "student_id": "test_student",
        "topic_id": "vectors",
        "question_id": "q1",
        "is_correct": True,
        "time_spent_ms": 1200,
        "confidence_score": 4,
        "timestamp": "2023-10-27T10:00:00"
    }
    try:
        res = requests.post(f"{BASE_URL}/analyze-interaction", json=interaction)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.json()}")
    except Exception as e:
        print(f"Failed: {e}")

    # 2. Get Profile
    print("\n2. Testing /profile/test_student...")
    try:
        res = requests.get(f"{BASE_URL}/profile/test_student")
        print(f"Status: {res.status_code}")
        print(f"Mastery Scores: {res.json().get('mastery_scores', {})}")
    except Exception as e:
        print(f"Failed: {e}")

    # 3. Get Recommendation
    print("\n3. Testing /recommendation/test_student...")
    try:
        res = requests.get(f"{BASE_URL}/recommendation/test_student")
        print(f"Status: {res.status_code}")
        print(f"Recommendation: {res.json()}")
    except Exception as e:
        print(f"Failed: {e}")

    # 4. Chat (Simulate)
    print("\n4. Testing /chat...")
    chat_req = {
        "student_id": "test_student",
        "message": "What are vectors?",
        "context_topic": "physics"
    }
    try:
        res = requests.post(f"{BASE_URL}/chat", json=chat_req)
        print(f"Status: {res.status_code}")
        print(f"Reply: {res.json().get('reply')}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    # Wait for server to start
    time.sleep(2)
    test_backend()
