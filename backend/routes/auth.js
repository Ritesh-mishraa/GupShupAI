// import express from 'express';
// import User from '../models/User.js';
// import Thread from '../models/Thread.js'; // Assuming you have a Thread model
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// const router = express.Router();

// // Middleware to authenticate user
// export const authenticate = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     try {
//         const decoded = jwt.verify(token, "your_jwt_secret");
//         req.user = decoded.userId; // Attach userId to the request
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Invalid token" });
//     }
// };

// router.post('/register', async (req, res) => {
//     const { username, email, password } = req.body;
//     try{
//         let user = await User.findOne({ email });
//         if(user){
//             return  res.status(400).json({ message: "User already exists" });
//         }  
//         user = new User({
//             username,
//             email,
//             password: await bcrypt.hash(password, 10)
//         });
//         await user.save();
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.json({ message: "All fields are required" });
//     }
    
//     try{
//         const user = await User.findOne({ email });
//         if(!user){
//             return res.status(400).json({ message: "Invalid credentials" });
//         }   
//         const isMatch = await bcrypt.compare(password, user.password);
//         if(!isMatch){
//             return res.status(400).json({ message: "Invalid credentials" });
//         }
//         const token = jwt.sign({ userId: user._id }, "your_jwt_secret", { expiresIn: "1h" });
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // Get threads specific to the logged-in user
// router.get('/thread', authenticate, async (req, res) => {
//     try {
//         const threads = await Thread.find({ userId: req.user }); // Fetch threads for the logged-in user
//         res.json(threads);
//     } catch (error) {
//         res.status(500).json({ message: "Server error" });
//     }
// });

// // Export both router and authenticate as named exports
// export default router;


import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// ==========================================
// MIDDLEWARE: Protect Routes
// ==========================================
// This is perfect. It extracts the ID and puts it in req.user
// logic: req.user = "65a123..." (The User ID String)
export const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No Token" });
    }
    
    try {
        // Use env variable for secret, fallback to string for dev
        const secret = process.env.JWT_SECRET || "your_jwt_secret";
        
        const decoded = jwt.verify(token, secret);
        
        // CRITICAL: This matches what chat.js expects
        req.user = decoded.userId; 
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or Expired Token" });
    }
};

// ==========================================
// 1. REGISTER
// ==========================================
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ==========================================
// 2. LOGIN
// ==========================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate Token
        const secret = process.env.JWT_SECRET || "your_jwt_secret";
        
        // We sign the 'userId' into the token
        const token = jwt.sign(
            { userId: user._id }, 
            secret, 
            { expiresIn: "1h" }
        );
        
        res.json({ token, username: user.username });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Note: I removed the GET /thread route from here. 
// It is already in your chat.js file, which is the correct place for it.

export default router;