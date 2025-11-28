export const gemini = {
    chat: async (message: string, context: string) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const msg = message.toLowerCase();

        // --- 1. Greetings & Personality (Global) ---
        if (msg.match(/^(hi|hello|hey|greetings)/)) {
            return `Hoot! Hello there, Cadet! I'm Professor Owl 🦉. I'm here to help you navigate the **${context}** realm. What's on your mind?`;
        }

        if (msg.includes('who are you') || msg.includes('your name')) {
            return "I am Professor Owl, your AI guide to the brAIn universe! I may be made of code, but I have the wisdom of... well, a very smart bird. 🦉";
        }

        if (msg.includes('help') || msg.includes('stuck')) {
            return "Don't worry! Try exploring the interactive modules. Click on the cards to enter a realm. If you have a specific question about Physics, Math, or Chemistry, just ask!";
        }

        // --- 2. Global Knowledge Base (Answers regardless of context) ---
        
        // Physics Knowledge
        if (msg.includes('ohm') || msg.includes('resistance') || msg.includes('voltage')) {
            return "Ohm's Law is fundamental! It states that **V = I * R**, where V is Voltage, I is Current, and R is Resistance. Imagine water flowing through a pipe: Voltage is the pressure, Current is the flow rate, and Resistance is the pipe width! ⚡";
        }
        if (msg.includes('newton') || msg.includes('force') || msg.includes('gravity') || msg.includes('apple')) {
            return "Ah, Sir Isaac Newton! His laws govern motion. **F = ma** (Force = mass * acceleration) is the big one. And don't forget gravity - it's what keeps my feathers from floating away! 🍎";
        }
        if (msg.includes('energy') || msg.includes('kinetic') || msg.includes('potential')) {
            return "Energy is never created or destroyed, only transformed! Kinetic energy is motion (like me flying), and potential energy is stored (like me perched high on a branch). 🔋";
        }

        // Chemistry Knowledge
        if (msg.includes('atom') || msg.includes('molecule') || msg.includes('bond') || msg.includes('element')) {
            return "Atoms are the building blocks of everything! They bond together to form molecules. It's like cosmic LEGOs! ⚛️";
        }
        if (msg.includes('reaction') || msg.includes('mix') || msg.includes('explode')) {
            return "Chemical reactions are exciting! Reactants transform into products. Sometimes it goes BOOM (but hopefully not in our lab)! 💥";
        }
        if (msg.includes('state') || msg.includes('solid') || msg.includes('liquid') || msg.includes('gas') || msg.includes('matter')) {
            return "Matter changes states based on temperature and pressure. Solids are rigid, liquids flow, and gases... well, they're all over the place! 🧊💧☁️";
        }

        // Math Knowledge
        if (msg.includes('pi') || msg.includes('circle') || msg.includes('3.14')) {
            return "Pi (π) is approximately 3.14159... It's the ratio of a circle's circumference to its diameter. Deliciously irrational! 🥧";
        }
        if (msg.includes('equation') || msg.includes('solve') || msg.includes('algebra') || msg.includes('x')) {
            return "Equations are like puzzles. You have to balance both sides to find the missing piece (x). Keep your logic sharp! ➕➖✖️➗";
        }

        // --- 3. Context-Specific Fallback (If no keyword matched) ---
        // If the user asks something vague like "What is this?", use the context.
        if (msg.includes('what is this') || msg.includes('where am i')) {
             if (context === 'physics') return "You are in the **PhysiX Dimension**! Here we study the forces that shape the universe.";
             if (context === 'chemistry') return "Welcome to the **Chemiverse**! This is where we explore the building blocks of matter.";
             if (context === 'math') return "This is the **Math Odyssey**. Prepare to visualize the language of the cosmos!";
             return "You are at the **Home Base**. Choose a realm to start your journey!";
        }

        // Default Response
        return `Hoot! That's an interesting question about **${context}**. 
        
I'm still training my neural feathers on that specific topic. Try asking me about:
- **Physics**: Newton's Laws, Energy, Ohm's Law
- **Chemistry**: Atoms, Reactions, States of Matter
- **Math**: Geometry, Algebra

Or just ask me to tell you a science joke! 🧪`;
    }
};
