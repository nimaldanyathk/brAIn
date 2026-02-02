from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class QuizInteraction(BaseModel):
    student_id: str
    topic_id: str
    question_id: str
    is_correct: bool
    time_spent_ms: int
    confidence_score: int  # 1-5
    timestamp: datetime

class StudentProfile(BaseModel):
    student_id: str
    mastery_scores: Dict[str, float] = {}  # topic_id -> score (0.0 to 1.0)
    history: List[str] = [] # List of past interactions/topic_ids
    topic_exposure_counts: Dict[str, int] = {}
    last_active: Optional[datetime] = None
    learnig_style_cluster: int = 0
    srs_data: Dict = {} # topic_id -> {interval, repetitions, ef, next_review}Dict[str, int]

class Recommendation(BaseModel):
    next_topic_id: str
    reason: str
    difficulty_level: str  # 'easy', 'medium', 'hard'
    suggested_content_type: str  # 'video', 'article', 'quiz'

class ChatRequest(BaseModel):
    student_id: str
    message: str
    context_topic: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]
