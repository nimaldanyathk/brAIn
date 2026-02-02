from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from models import QuizInteraction, StudentProfile, Recommendation, ChatRequest, ChatResponse
from ml_engine import MLEngine
from gemini_client import get_chat_response, generate_quiz
import uvicorn
import os

app = FastAPI(title="brAIn AI Backend")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify the frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from notes_service import NotesService, Note
from knowledge_graph import TOPIC_METADATA, PREREQUISITES

# Initialize Services
ml_engine = MLEngine()
notes_service = NotesService()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "brAIn Intelligence Layer Active"}

@app.get("/api/graph/{student_id}")
async def get_knowledge_graph(student_id: str):
    import traceback
    try:
        # dynamic graph based on student progress
        nodes = []
        edges = []
        
        # 1. Add ALL topics from Metadata as Nodes
        for topic_id, meta in TOPIC_METADATA.items():
            try:
                mastery = ml_engine.get_mastery(student_id, topic_id)
            except Exception:
                mastery = 0.0
            
            # Determine status color
            color = "#e5e7eb" # gray-200
            if mastery > 0.8:
                color = "#4ade80" # green-400
            elif mastery > 0.4:
                color = "#facc15" # yellow-400
            elif mastery > 0.1:
                color = "#60a5fa" # blue-400
                
            nodes.append({
                "id": topic_id,
                "data": { "label": f"{meta['name']} ({int(mastery*100)}%)" },
                "position": { "x": 0, "y": 0 }, # Layout handled by frontend
                "style": { 
                    "background": color,
                    "color": "#000",
                    "width": 150,
                    "fontSize": 12,
                    "fontWeight": "bold",
                    "border": "2px solid #000",
                    "borderRadius": "8px",
                    "textAlign": "center"
                }
            })

        # 2. Add Edges from Prerequisites
        for child, parents in PREREQUISITES.items():
            for parent in parents:
                edges.append({
                    "id": f"e-{parent}-{child}",
                    "source": parent,
                    "target": child,
                    "animated": True,
                    "style": { "stroke": "#000", "strokeWidth": 2 }
                })

        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        print(f"CRITICAL GRAPH ERROR: {e}")
        traceback.print_exc()
        return {"nodes": [], "edges": []}

@app.post("/api/notes", response_model=Note)
def add_note(note: Note):
    # Note: The input model expects an ID, but we ignore it on creation usually. 
    # For simplicity, we just take the content.
    return notes_service.add_note(note.student_id, note.topic_id, note.content)

@app.get("/api/notes/{student_id}/{topic_id}")
def get_notes(student_id: str, topic_id: str):
    return notes_service.get_notes(student_id, topic_id)

@app.post("/api/analyze-interaction")
def analyze_interaction(interaction: QuizInteraction):
    """
    Ingest a quiz result (correct/incorrect, time spent using the quiz) and update attributes.
    Returns the updated mastery and spaced repetition schedule.
    """
    result = ml_engine.update_profile(interaction)
    return result

@app.get("/api/search")
def search_topics(q: str, student_id: str):
    """
    Search for topics. Returns filtered list with SRS mastery status.
    """
    q = q.lower()
    profile = ml_engine.get_profile(student_id)
    srs_data = profile.srs_data
    mastery = profile.mastery_scores
    
    results = []
    # Search in topic metadata
    for tid, meta in TOPIC_METADATA.items():
        if q in tid.lower() or q in meta["name"].lower() or q in meta["description"].lower():
            # Calculate review status
            srs_info = srs_data.get(tid, {})
            next_review = srs_info.get("next_review")
            is_due = False
            if next_review:
                is_due = datetime.fromisoformat(next_review) <= datetime.now()
            elif mastery.get(tid, 0.0) == 0.0:
                is_due = True # New topic is technically "due" to start
                
            results.append({
                "id": tid,
                "name": meta["name"],
                "description": meta["description"],
                "mastery": mastery.get(tid, 0.0),
                "is_due": is_due,
                "next_review": next_review
            })
            
    return results

@app.get("/api/recommendation/{student_id}", response_model=Recommendation)
def get_recommendation(student_id: str):
    """
    Get the next best topic to study based on the knowledge graph.
    """
    recommendation = ml_engine.generate_recommendation(student_id)
    return recommendation

@app.get("/api/generate-plan")
def generate_plan(goal: str):
    """
    Generates a study plan based on a text goal.
    Returns: List[{id, title, description, icon}]
    """
    plan = ml_engine.generate_plan(goal)
    return plan

@app.get("/api/generate-quiz")
def generate_quiz_endpoint(topic: str, student_id: str):
    """
    Generates a personalized quiz.
    """
    import json
    import traceback
    try:
        profile = ml_engine.get_profile(student_id)
        # Convert to dict for context
        context = {
            "mastery_scores": profile.mastery_scores,
            "recent_history": profile.history[-3:] if profile.history else []
        }
        
        quiz_json = generate_quiz(topic, context)
        return json.loads(quiz_json)
    except Exception as e:
        print(f"Quiz Endpoint Error: {e}")
        traceback.print_exc()
        return {"error": str(e), "trace": traceback.format_exc()}

@app.get("/api/profile/{student_id}", response_model=StudentProfile)
def get_profile(student_id: str):
    return ml_engine.get_profile(student_id)

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Chat with the AI Tutor. The AI has context of the student's mastery.
    """
    profile = ml_engine.get_profile(request.student_id)
    # Convert profile model to dict for the gemini helper
    profile_dict = profile.dict()
    
    response_text = get_chat_response(
        request.message, 
        request.context_topic, 
        profile_dict
    )
    
    return ChatResponse(
        reply=response_text,
        suggested_actions=[]
    )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
