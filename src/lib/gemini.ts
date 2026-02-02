const API_URL = "http://localhost:8000/api";

export const gemini = {
    chat: async (message: string, context: string) => {
        try {
            // Assume a default student ID for the demo if not in local storage
            const studentId = localStorage.getItem('student_id') || 'demo_student_123';

            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    student_id: studentId,
                    message: message,
                    context_topic: context
                }),
            });

            if (!response.ok) {
                console.error("Backend error:", response.statusText);
                return "Hoot! I'm having trouble connecting to my knowledge base. Please try again later.";
            }

            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.error("Chat error:", error);
            // Fallback for offline or connection error
            return "Hoot! I seem to be offline. I can't reach my AI backend right now, but I'm still here to cheer you on! 🦉";
        }
    }
};
