// import dotenv from "dotenv";
// import { GoogleGenAI } from '@google/genai';

// dotenv.config();
// const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);


// const generateGeminiContent = async (chatHistory) => {
//   try {
//     const contents = chatHistory.map(msg => {
//       const role = (msg.role === 'assistant') ? 'model' : 'user';
//       const parts = [{ text: msg.content }]; 
//       return { role, parts };
//     });
//     const result = await genAI.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: contents, 
//     });

//     const text = result.text;
//     return text;

//   } catch (e) {
//     console.error("Error in generateGeminiContent:", e);
//     if (e.error) {
//        console.error("API Error details:", JSON.stringify(e.error, null, 2));
//     }
//     throw new Error("Failed to generate content from Gemini.");
//   }
// }

// export default generateGeminiContent;


import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// USE THIS EXACT MODEL NAME
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const generateGeminiContent = async (mongooseMessages) => {
  try {
    if (!mongooseMessages || mongooseMessages.length === 0) {
      return "I didn't receive a message to process.";
    }

    const plainMessages = mongooseMessages.map(msg => 
      typeof msg.toObject === 'function' ? msg.toObject() : msg
    );

    // Filter out any messages with empty content to prevent API errors
    const validMessages = plainMessages.filter(msg => msg.content && msg.content.trim() !== "");

    const formattedHistory = validMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    if (formattedHistory.length === 0) {
        return "Please provide a valid message.";
    }

    const lastMessageObj = formattedHistory[formattedHistory.length - 1];
    const currentMessage = lastMessageObj.parts[0].text;
    
    // Create history without the last message
    const history = formattedHistory.slice(0, -1); 

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(currentMessage);
    const response = await result.response;
    
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting to the AI right now. Please check your API key.";
  }
};

export default generateGeminiContent;