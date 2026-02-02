import json
import os
from typing import List, Dict
from pydantic import BaseModel
from datetime import datetime

class Note(BaseModel):
    id: str
    student_id: str
    topic_id: str
    content: str
    timestamp: datetime

class NotesService:
    def __init__(self, data_file="notes_data.json"):
        self.data_file = data_file
        self.notes = self._load_data()

    def _load_data(self) -> List[Dict]:
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r") as f:
                    return json.load(f)
            except:
                return []
        return []

    def _save_data(self):
        with open(self.data_file, "w") as f:
            json.dump(self.notes, f, default=str, indent=2)

    def add_note(self, student_id: str, topic_id: str, content: str) -> Note:
        note = {
            "id": str(int(datetime.now().timestamp())),
            "student_id": student_id,
            "topic_id": topic_id,
            "content": content,
            "timestamp": datetime.now().isoformat()
        }
        self.notes.append(note)
        self._save_data()
        return Note(**note)

    def get_notes(self, student_id: str, topic_id: str = None) -> List[Note]:
        results = [n for n in self.notes if n["student_id"] == student_id]
        if topic_id:
            results = [n for n in results if n["topic_id"] == topic_id]
        return [Note(**n) for n in results]
