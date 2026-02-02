from datetime import datetime, timedelta
from typing import Dict, Tuple

class SRSEngine:
    """
    Implements a simplified SuperMemo-2 (SM-2) algorithm for Spaced Repetition.
    """
    
    @staticmethod
    def calculate_next_review(row: Dict, quality: int) -> Tuple[datetime, float, int, int]:
        """
        Calculates the next review date based on the user's performance.
        
        Args:
            row (Dict): The current state of the item (interval, repetitions, ef).
                - interval (int): Days since last review.
                - repetitions (int): Number of consecutive correct answers.
                - ef (float): Easiness Factor (starts at 2.5).
            quality (int): 0-5 rating of how easy the recall was.
                - 5: Perfect response.
                - 4: Correct response after hesitation.
                - 3: Correct response recalled with serious difficulty.
                - 2: Incorrect response; where the correct one seemed easy to recall.
                - 1: Incorrect response; the correct one remembered.
                - 0: Complete blackout.
        
        Returns:
            Tuple[datetime, float, int, int]: (next_review_date, new_ef, new_reps, new_interval)
        """
        
        # Current State
        interval = row.get("interval", 0)
        repetitions = row.get("repetitions", 0)
        ef = row.get("easiness_factor", 2.5)

        if quality >= 3:
            # Correct response
            if repetitions == 0:
                interval = 1
            elif repetitions == 1:
                interval = 6
            else:
                interval = int(interval * ef)
            
            repetitions += 1
        else:
            # Incorrect response: Reset
            repetitions = 0
            interval = 1
        
        # Update Easiness Factor (SM-2 Formula)
        # EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
        new_ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        if new_ef < 1.3:
            new_ef = 1.3
            
        next_review = datetime.now() + timedelta(days=interval)
        
        return next_review, new_ef, repetitions, interval

    @staticmethod
    def get_status_message(next_review: datetime) -> str:
        delta = (next_review - datetime.now()).days
        if delta <= 0:
            return "Due Now!"
        elif delta == 1:
            return "See you tomorrow!"
        else:
            return f"Review in {delta} days"
