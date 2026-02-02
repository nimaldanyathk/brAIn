import google.generativeai as genai
import os
from typing import Dict
from dotenv import load_dotenv

load_dotenv() # Key Updated

# Configure API Key
# In a real scenario, we'd probably want to error out or prompt if missing.
# For demo, we might mock if no key found.
API_KEY = os.getenv("GEMINI_API_KEY")
if API_KEY:
    print(f"DEBUG: API Key loaded (starts with {API_KEY[:5]}...)")
    genai.configure(api_key=API_KEY)
else:
    print("DEBUG: API Key NOT found in environment.")

def get_chat_response(message: str, context_topic: str, student_profile: Dict) -> str:
    if not API_KEY:
        return "I'm sorry, I cannot connect to my brain (API Key missing). But I think you are doing great!"

    model = genai.GenerativeModel('gemini-flash-latest')
    
    # Construct a personalized system prompt
    mastery_summary = ", ".join([f"{k}: {v:.1f}" for k,v in student_profile.get('mastery_scores', {}).items() if v > 0.1])
    
    prompt = f"""
    You are Professor Owl, a wise and encouraging AI tutor.
    The student is asking: "{message}"
    Current Context: {context_topic}
    Student's Mastery Profile: {mastery_summary}
    
    1. Answer the question simply and clearly.
    2. If the student has low mastery in this topic, use analogies.
    3. If high mastery, challenge them slightly.
    4. Keep it concise (under 3 sentences usually).
    5. Always end with an encouraging "Hoot!" or owl emoji.
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Hoot! My feathers are ruffled. (Error: {str(e)})"

def generate_study_plan_from_goal(goal: str, available_topics: Dict) -> str:
    """
    Generates a list of topics to study based on the user's goal.
    Returns a JSON string list of topic_ids.
    """
    if not API_KEY:
        return _get_mock_plan(goal)

    model = genai.GenerativeModel('gemini-flash-latest')
    
    topics_list = ", ".join([f"{k} ({v['name']})" for k,v in available_topics.items()])
    
    prompt = f"""
    You are an expert tactical curriculum designer for a STEM elite training program.
    The student wants to: "{goal}"
    
    MISSION ASSETS (Available Modules):
    {topics_list}
    
    DIRECTIVES:
    1. Analyze the student's goal.
    2. Build a "Tactical Path" of 3-5 modules leading TO the goal.
    3. CRITICAL: The LAST phase must be the goal topic itself (if available).
    4. PRE-REQUISITES RULE: 
       - Foundational topics (e.g. Vectors, Algebra, Atoms) have NO prerequisites. Start with them directly.
       - Advanced topics (e.g. Rocketry) require foundations first.
       - NEVER put an advanced topic (like Kinematics) as a prerequisite for a basic one (like Vectors).
    5. EXACT IDs: You MUST use the exact `id` from the list.
    
    OUTPUT FORMAT:
    Return a JSON list of objects. Each object represents a Mission Phase:
       - "id": The module ID (EXACT MATCH from Mission Assets).
       - "title": A tactical mission name (e.g. "Phase 1: Foundation").
       - "description": Why this step is required.
       - "icon": Visual identifier.
    
    Exmaple Plan for "Build a Robot":
    [
        {{"id": "vectors", "title": "Phase 1: Coordinate Systems", "description": "Learn to navigate 3D space.", "icon": "Target"}},
        {{"id": "newtons_laws", "title": "Phase 2: Mechanical Force", "description": "Understand torque and movement.", "icon": "Settings"}},
        {{"id": "ohms_law", "title": "Phase 3: Power Systems", "description": "Manage energy flow to servos.", "icon": "Zap"}}
    ]
    
    Return ONLY valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return text
    except Exception as e:
        print(f"Plan Gen Error: {e}")
        return _get_mock_plan(goal)

def _get_mock_plan(goal: str) -> str:
    """Smart fallback for demo/error states."""
    g = goal.lower()
    
    if "rocket" in g or "flight" in g:
        return """[
            {"id": "vectors", "title": "Phase 1: Navigation Systems", "description": "Establishing spatial coordinates for flight.", "icon": "Target"},
            {"id": "newtons_laws", "title": "Phase 2: Propulsion Physics", "description": "Thrust vs. Drag mechanics.", "icon": "Rocket"},
            {"id": "rocketry", "title": "Phase 3: Orbital Injection", "description": "Achieving escape velocity.", "icon": "Globe"}
        ]"""
        
    if "grav" in g or "orbit" in g:
        return """[
            {"id": "newtons_laws", "title": "Phase 1: Force Dynamics", "description": "Understanding mass and acceleration.", "icon": "Settings"},
            {"id": "gravitation", "title": "Phase 2: Universal Attraction", "description": "Calculating orbital mechanics.", "icon": "Globe"},
            {"id": "relativity", "title": "Phase 3: Spacetime Curvature", "description": "Advanced gravity concepts.", "icon": "Activity"}
        ]"""

    if "atom" in g or "chem" in g or "molecule" in g:
        return """[
            {"id": "algebra", "title": "Phase 1: Quantum Math", "description": "Calculating probabilistic shells.", "icon": "Calculator"},
            {"id": "atoms", "title": "Phase 2: Subatomic Structure", "description": "Protons, neutrons, and electron clouds.", "icon": "Atom"},
            {"id": "periodic_table", "title": "Phase 3: Elemental Classification", "description": "Predicting atomic behavior.", "icon": "Layers"}
        ]"""
    
    if "vector" in g:
        return """[
            {"id": "vectors", "title": "Phase 1: Directionality", "description": "Mastering magnitude and orientation.", "icon": "Target"}
        ]"""
        
    if "calc" in g or "deriv" in g:
        return """[
            {"id": "algebra", "title": "Phase 1: Variable Mastery", "description": "Foundational equations.", "icon": "Calculator"},
            {"id": "trigonometry", "title": "Phase 2: Wave Functions", "description": "Cyclical analysis.", "icon": "Activity"},
            {"id": "calculus", "title": "Phase 3: Rate of Change", "description": "Integration and differentiation.", "icon": "TrendingUp"}
        ]"""

    # Direct MetaData Match (Catch-all for simple topics)
    # This is a bit tricky since we don't have access to keys here easily unless passed, 
    # but we can try common ones.
    if "optics" in g:
         return """[{"id": "geometry", "title": "Phase 1: Light Angles", "description": "Reflection basics.", "icon": "Target"}, {"id": "optics", "title": "Phase 2: Light Physics", "description": "Refraction and lenses.", "icon": "Sun"}]"""

    # Default Physics Fallback
    return """[
        {"id": "vectors", "title": "Phase 1: Calibration", "description": "Aligning sensor array.", "icon": "Target"},
        {"id": "kinematics", "title": "Phase 2: Motion Tracking", "description": "Velocity and acceleration.", "icon": "Activity"},
        {"id": "newtons_laws", "title": "Phase 3: Force Application", "description": "Dynamics and impact.", "icon": "Zap"}
    ]"""

def generate_quiz(topic_id: str, context: Dict) -> str:
    """
    Generates a personalized quiz for the student based on the topic.
    Returns a JSON list of Question objects.
    """
    import json
    if not API_KEY:
        return _get_mock_quiz(topic_id)

    model = genai.GenerativeModel('gemini-flash-latest')
    
    # Context summary for prompt
    mastery = context.get('mastery_scores', {}).get(topic_id, 0.1)
    
    prompt = f"""
    You are an expert examiner for a STEM training program.
    Generate a short, 3-question adaptive quiz for the topic: "{topic_id}".
    
    Student Mastery Level: {mastery} (0.0=Novice, 1.0=Expert)
    
    DIRECTIVES:
    1. Questions should check for conceptual understanding, not just rote memorization.
    2. If mastery is low (<0.3), keep it foundational. If high (>0.7), make it challenging.
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
    
    Return ONLY valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        # Validate JSON
        json.loads(text)
        return text
    except Exception as e:
        print(f"Quiz Gen Error: {e}")
        return _get_mock_quiz(topic_id)

def _get_mock_quiz(topic_id: str) -> str:
    import json
    # Dynamic Mock Data based on topic keyword
    t = topic_id.lower()
    
    q1 = {"id": 1, "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "Placeholder."}
    
    if "atom" in t:
        q1["text"] = "What is the center of an atom called?"
        q1["options"] = ["Nucleus", "Electron", "Proton", "Orbit"]
        q1["correctAnswer"] = 0
        q1["explanation"] = "The nucleus contains protons and neutrons."
    elif "vector" in t:
        q1["text"] = "What distinguishes a vector from a scalar?"
        q1["options"] = ["Direction", "Magnitude", "Color", "Weight"]
        q1["correctAnswer"] = 0
        q1["explanation"] = "Vectors have both magnitude and direction."
    else:
        q1["text"] = f"What is the core principle of {topic_id}?"
        q1["options"] = ["Concept A", "Concept B", "Concept C", "Concept D"]
        q1["explanation"] = "This is a generated fallback quiz."
        
    return json.dumps([q1])

