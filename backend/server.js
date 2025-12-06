import dotenv from "dotenv";
import express from "express";
import { GoogleGenAI } from '@google/genai';
import mongoose from "mongoose";
import Thread from "./models/Thread.js";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";

dotenv.config();

// Ensure environment variables are loaded
if (!process.env.MONGO_URI || !process.env.GEMINI_API_KEY) {
  console.error("❌ Missing required environment variables (MONGO_URI, GEMINI_API_KEY)");
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/api/auth", authRoutes)
app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000;
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// app.post("/test", async(req, res)=>{
//   try{
//     const prompt = req.body.prompt || "Write a short poem about the sea.";

//     const result = await genAI.models.generateContent({
//       model: "gemini-2.5-flash-lite",
//       contents: prompt, 
//     });

//     const text = result.text;
//     console.log(`Sending response: ${text}`);

//     // Send the Gemini response back to the client
//     res.status(200).json({ gemini_response: text });
//   }catch(e){
//     console.log(e);
//   }
// })

// app.post("/chat", async (req, res) => {
//   try {
//     const userMessage = req.body.prompt || "What is the capital of France?";

//     const result = await query({
//       model: "HuggingFaceH4/zephyr-7b-beta:featherless-ai",
//       messages: [
//         {
//           role: "user",
//           content: userMessage,
//         },
//       ],
//     });

//     //console.log("Raw response:", JSON.stringify(result, null, 2));

//     // extract the message
//     const message = result.choices?.[0]?.message?.content || "No response.";
//     console.log("Extracted message:", message);
//     res.json({ reply: message });
//   } catch (err) {
//     console.error("Error:", err.message);
//     res.status(500).send("Internal Server Error");
//   }
// });


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
