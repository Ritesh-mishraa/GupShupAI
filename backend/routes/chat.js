// import express from 'express';
// import Thread from '../models/Thread.js';
// import { v4 as uuidv4 } from 'uuid';
// import generateGeminiContent from '../utils/gemini.js';
// import {authenticate}  from './auth.js'; 

// const router = express.Router();

// // Test route
// router.post("/test", async (req, res) => {
//     try {
//         const thread = new Thread({
//             threadId: "xyz",
//             title: "Testing"
//         });
//         const response = await thread.save();
//         res.send(response);
//     } catch (err) {
//         console.log(err);
//         res.status(500).send("Server Error");
//     }
// });

// // Get all threads (sorted by updatedAt)
// router.get("/thread", async (req, res) => {
//     try {
//         const threads = await Thread.find({}).sort({ updatedAt: -1 });
//         res.json(threads);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server Error" });
//     }
// });

// // Get a specific thread by threadId
// router.get("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;

//     try {
//         const thread = await Thread.findOne({ threadId });
//         if (!thread) {
//             return res.status(404).json({ error: "Thread Not Found" });
//         }
//         res.json(thread);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server Error" });
//     }
// });

// // Delete a thread by threadId
// router.delete("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;

//     try {
//         const deletedThread = await Thread.findOneAndDelete({ threadId });
//         if (!deletedThread) {
//             return res.status(404).json({ error: "Thread Not Found" });
//         }
//         res.status(200).json({ message: "Thread Deleted Successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server Error" });
//     }
// });

// // Chat route: Add a message to a thread or create a new thread
// router.post("/chat", async (req, res) => {
//     const { threadId, message } = req.body;

//     if (!threadId || !message) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     try {
//         let thread = await Thread.findOne({ threadId });

//         if (!thread) {
//             thread = new Thread({
//                 threadId: uuidv4(), // Generate a unique threadId
//                 title: message.slice(0, 20), // Use the first 20 characters of the message as the title
//                 messages: [{ role: "user", content: message }]
//             });
//         } else {
//             thread.messages.push({ role: "user", content: message });
//         }

//         // const historyForGemini = thread.messages.map(msg => ({
//         //     role: msg.role,
//         //     content: msg.content
//         // }));

//         console.log("Sending to Gemini:", JSON.stringify(thread.messages, null, 2));

//         const assistantReply = await generateGeminiContent(thread.messages);

//         thread.messages.push({ role: "assistant", content: assistantReply });

//         await thread.save();
//         res.json({ reply: assistantReply });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server Error" });
//     }
// });

// // Create a new thread
// router.post('/create-thread', authenticate, async (req, res) => {
//     const { title } = req.body;

//     if (!title) {
//         return res.status(400).json({ message: 'Title is required' });
//     }

//     const threadId = uuidv4(); // Generate a unique threadId

//     try {
//         const thread = new Thread({
//             threadId,
//             userId: req.user, // Use the authenticated user's ID
//             title,
//             messages: [],
//         });

//         await thread.save();
//         res.status(201).json({ message: 'Thread created successfully', thread });
//     } catch (error) {
//         console.error('Error creating thread:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// export default router;



import express from 'express';
import Thread from '../models/Thread.js';
import { v4 as uuidv4 } from 'uuid';
import generateGeminiContent from '../utils/gemini.js';
import { authenticate } from './auth.js'; // Ensure this middleware populates req.user

const router = express.Router();

// ==========================================
// 1. GET ALL THREADS (User Specific)
// ==========================================
router.get("/thread", authenticate, async (req, res) => {
    try {
        // FIX: Only find threads that belong to the logged-in user
        // We assume 'req.user' contains the userId string (based on your auth.js)
        const threads = await Thread.find({ userId: req.user }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.error("Error fetching threads:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 2. GET SINGLE THREAD
// ==========================================
router.get("/thread/:threadId", authenticate, async (req, res) => {
    const { threadId } = req.params;

    try {
        // FIX: Security check. Find by threadId AND userId.
        // This prevents User A from accessing User B's thread by guessing the ID.
        const thread = await Thread.findOne({ 
            threadId: threadId, 
            userId: req.user 
        });

        if (!thread) {
            return res.status(404).json({ error: "Thread Not Found or Access Denied" });
        }
        res.json(thread);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 3. DELETE THREAD
// ==========================================
router.delete("/thread/:threadId", authenticate, async (req, res) => {
    const { threadId } = req.params;

    try {
        // FIX: Ensure we only delete if the thread belongs to the user
        const deletedThread = await Thread.findOneAndDelete({ 
            threadId: threadId, 
            userId: req.user 
        });

        if (!deletedThread) {
            return res.status(404).json({ error: "Thread Not Found or Access Denied" });
        }
        res.status(200).json({ message: "Thread Deleted Successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 4. MAIN CHAT ROUTE (Create or Update)
// ==========================================
router.post("/chat", authenticate, async (req, res) => {
    const { threadId, message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        // 1. Try to find the existing thread for this user
        let thread = await Thread.findOne({ 
            threadId: threadId, 
            userId: req.user 
        });

        // 2. If no thread exists (or threadId was null/new), create one
        if (!thread) {
            // If the frontend sent a threadId but it wasn't found in DB, 
            // we usually generate a new one to be safe, or use the one sent if it's a valid UUID.
            // Here we generate a fresh one to guarantee uniqueness.
            const newThreadId = threadId || uuidv4();

            thread = new Thread({
                threadId: newThreadId,
                userId: req.user, // <--- CRITICAL FIX: Associate with User
                title: message.slice(0, 30) + "...", // Slightly longer title
                messages: [{ role: "user", content: message }]
            });
        } else {
            // 3. If thread exists, just push the user message
            thread.messages.push({ role: "user", content: message });
        }

        // 4. Debug logging
        // console.log("Sending to Gemini:", JSON.stringify(thread.messages, null, 2));

        // 5. Get AI Response
        const assistantReply = await generateGeminiContent(thread.messages);

        // 6. Save AI response to DB
        thread.messages.push({ role: "assistant", content: assistantReply });
        await thread.save();

        // 7. Return the reply AND the threadId (in case we created a new one)
        res.json({ 
            reply: assistantReply, 
            threadId: thread.threadId 
        });

    } catch (err) {
        console.error("Chat Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// ==========================================
// 5. MANUAL CREATE THREAD (Optional)
// ==========================================
// You might not need this if logic is handled in /chat, but keeping it just in case.
router.post('/create-thread', authenticate, async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const threadId = uuidv4();

    try {
        const thread = new Thread({
            threadId,
            userId: req.user, // Fix: Associate with User
            title,
            messages: [],
        });

        await thread.save();
        res.status(201).json({ message: 'Thread created successfully', thread });
    } catch (error) {
        console.error('Error creating thread:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;