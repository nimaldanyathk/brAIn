import json
import os
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Optional
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from srs_engine import SRSEngine
from models import QuizInteraction, StudentProfile, Recommendation
from knowledge_graph import get_prerequisites, TOPIC_METADATA

class MLEngine:
    def __init__(self, data_file="student_data.json"):
        self.data_file = data_file
        self.profiles = self._load_data()

    def _load_data(self) -> Dict[str, dict]:
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, "r") as f:
                    data = json.load(f)
                    return data if isinstance(data, dict) else {}
            except (json.JSONDecodeError, Exception):
                print("Warning: Corrupt student_data.json. Resetting.")
                return {}
        return {}
    
    def _save_data(self):
        try:
            with open(self.data_file, "w") as f:
                json.dump(self.profiles, f, default=str, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")

    def get_profile(self, student_id: str) -> StudentProfile:
        defaults = {
            "student_id": student_id,
            "mastery_scores": {t: 0.1 for t in TOPIC_METADATA.keys()}, # Start with low mastery
            "learning_style": "visual", 
            "topic_exposure_counts": {t: 0 for t in TOPIC_METADATA.keys()},
            "last_active": datetime.now().isoformat(),
            "history": [] 
        }

        if student_id not in self.profiles:
            self.profiles[student_id] = defaults
            self._save_data()
        else:
            # Integrity Check: Ensure existing profile has all needed keys
            p = self.profiles[student_id]
            modified = False
            for k, v in defaults.items():
                if k not in p:
                    p[k] = v
                    modified = True
            
            # Ensure mastery scores exist for ALL new topics (e.g. Rocketry)
            for t in TOPIC_METADATA.keys():
                if t not in p["mastery_scores"]:
                    p["mastery_scores"][t] = 0.1
                    modified = True

            if modified:
                self._save_data()
        
        p = self.profiles[student_id]
        return StudentProfile(
            student_id=p["student_id"],
            mastery_scores=p["mastery_scores"],
            learning_style=p["learning_style"],
            topic_exposure_counts=p["topic_exposure_counts"],
            last_active=datetime.fromisoformat(p["last_active"]) if isinstance(p["last_active"], str) else p["last_active"]
        )

    def update_profile(self, interaction: QuizInteraction):
        pid = interaction.student_id
        profile = self.profiles.get(pid)
        if not profile:
            self.get_profile(pid) # create if missing
            profile = self.profiles[pid]

        # --- 1. Mastery Calculation (Existing Logic) ---
        current_mastery = profile["mastery_scores"].get(interaction.topic_id, 0.1)
        learning_rate = 0.1
        
        if interaction.is_correct:
            time_factor = min(1.0, 5000 / (interaction.time_spent_ms + 1)) 
            gain = learning_rate * (1 + time_factor)
            new_mastery = min(1.0, current_mastery + gain)
            
            # Map to SRS Quality (4-5)
            # Fast + Confident = 5, Slow/Unsure = 4
            quality = 5 if interaction.confidence_score >= 4 and time_factor > 0.5 else 4
        else:
            penalty = learning_rate * (interaction.confidence_score / 5.0)
            new_mastery = max(0.0, current_mastery - penalty)
            
            # Map to SRS Quality (0-3)
            # High confidence error = 1, Low confidence error = 3 (closer to learning)
            quality = 1 if interaction.confidence_score >= 4 else 2
            
        profile["mastery_scores"][interaction.topic_id] = new_mastery
        
        # --- 2. Spaced Repetition Update (New Logic) ---
        if "srs_data" not in profile:
            profile["srs_data"] = {}
            
        current_srs = profile["srs_data"].get(interaction.topic_id, {})
        next_review, new_ef, new_reps, new_interval = SRSEngine.calculate_next_review(current_srs, quality)
        
        profile["srs_data"][interaction.topic_id] = {
            "interval": new_interval,
            "repetitions": new_reps,
            "easiness_factor": new_ef,
            "next_review": next_review.isoformat(),
            "last_quality": quality
        }
        
        # 3. Update Exposure
        profile["topic_exposure_counts"][interaction.topic_id] = profile["topic_exposure_counts"].get(interaction.topic_id, 0) + 1
        
        # 4. Store raw interaction
        if "history" not in profile:
            profile["history"] = []
        profile["history"].append(interaction.dict())
        
        profile["last_active"] = datetime.now()
        self._save_data()
        
        return {
            "mastery": new_mastery,
            "srs_message": SRSEngine.get_status_message(next_review),
            "next_review": next_review.isoformat()
        }

    def get_mastery(self, student_id: str, topic_id: str) -> float:
        try:
            profile = self.get_profile(student_id)
            return profile.mastery_scores.get(topic_id, 0.0)
        except Exception as e:
            print(f"Error getting mastery for {student_id}/{topic_id}: {e}")
            return 0.0

    def calculate_mastery(self, student_id: str, topic_id: str) -> float:
        # Alias for backward compatibility if needed
        return self.get_mastery(student_id, topic_id)

    def generate_recommendation(self, student_id: str) -> Recommendation:
        profile = self.get_profile(student_id)
        
        # Simple recommendation logic:
        # Find topics with prerequisites met but low mastery.
        
        candidates = []
        for topic, meta in TOPIC_METADATA.items():
            mastery = profile.mastery_scores.get(topic, 0)
            if mastery > 0.8:
                continue # Already mastered
                
            prereqs = get_prerequisites(topic)
            can_learn = True
            for p in prereqs:
                if profile.mastery_scores.get(p, 0) < 0.6:
                    can_learn = False
                    break
            
            if can_learn:
                candidates.append((topic, mastery))
        
        if not candidates:
            # Fallback or advanced topics
            return Recommendation(
                next_topic_id="newtons_laws", 
                reason="You've mastered the basics! Let's explore everything.",
                difficulty_level="medium",
                suggested_content_type="video"
            )
            
        # Select the one with lowest mastery to reinforce, or highest readiness
        candidates.sort(key=lambda x: x[1]) # Sort by mastery ascending
        target_topic = candidates[0][0]
        
        return Recommendation(
            next_topic_id=target_topic,
            reason=f"It's time to boost your skills in {TOPIC_METADATA[target_topic]['name']}. You have the prerequisites ready!",
            difficulty_level="medium",
            suggested_content_type="quiz" if profile.learning_style == "practice" else "video"
        )

    def analyze_learning_clusters(self):
        # Example of Batch ML: Cluster students by performance
        if len(self.profiles) < 3:
            return "Not enough data to cluster."
            
        data = []
        ids = []
        for pid, p in self.profiles.items():
            # Create feature vector: [avg_mastery, total_interactions]
            avg_mastery = np.mean(list(p["mastery_scores"].values()))
            total_exp = sum(p["topic_exposure_counts"].values())
            data.append([avg_mastery, total_exp])
            ids.append(pid)
            
        X = np.array(data)
        kmeans = KMeans(n_clusters=min(3, len(data)), random_state=42)
        kmeans.fit(X)
        
        return {ids[i]: int(label) for i, label in enumerate(kmeans.labels_)}

    def generate_plan(self, goal: str):
        from gemini_client import generate_study_plan_from_goal
        # Return list of topic objects
        plan_json = generate_study_plan_from_goal(goal, TOPIC_METADATA)
        try:
             # Validate that returned IDs are real
             plan = json.loads(plan_json)
             valid_plan = []
             for item in plan:
                 if isinstance(item, dict) and item.get("id") in TOPIC_METADATA:
                     valid_plan.append(item)
                 elif isinstance(item, str) and item in TOPIC_METADATA:
                     # Handle legacy simple string list just in case
                     valid_plan.append({"id": item, "title": f"Mission: {item}", "description": TOPIC_METADATA[item]["description"], "icon": "Target"})
             
             return valid_plan
        except Exception as e:
             print(f"Plan Parsing Error: {e}")
             return [{"id": "vectors", "title": "System Reboot", "description": "Fallback protocol initiated.", "icon": "RefreshCw"}]
