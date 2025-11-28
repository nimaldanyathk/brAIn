export const gemini = {
    chat: async (_message: string, context: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return `Hoot! I see you're asking about **${context}**. 
        
That's a fascinating topic! As a wise owl, I can tell you that... well, I'm still learning! 
        
But did you know that owls can rotate their heads 270 degrees? That's almost a full circle! 🦉`;
    }
};

