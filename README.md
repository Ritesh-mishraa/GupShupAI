# 💬 GupShupAI

**GupShupAI** is a full-stack intelligent chat application powered by Google's Gemini API. It features real-time conversational capabilities, voice-to-text input, secure user authentication, and persistent chat history.


## 🚀 Key Features

* 🧠 Gemini Integration: Leverages Google's Generative AI for smart, context-aware responses.
* 🎙️ Voice Input: Integrated Web Speech API allows users to speak directly to the AI.
* 🔐 Secure Auth: Full Signup/Login system using JWT (JSON Web Tokens) and Bcrypt.
* 💾 Cloud History: Chat threads are stored in MongoDB, allowing users to revisit past conversations.
* ⚡ Modern UI: Built with React, featuring typing effects, syntax highlighting for code, and a responsive sidebar.

## 🛠️ Tech Stack

Frontend :- React.js, Context API, CSS3, React Router
Backend :- Node.js, Express.js 
Database :- MongoDB, Mongoose 
AI :- Google Gemini SDK (`@google/generative-ai`)
Auth :- JWT, Bcrypt.js 

## 📦 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Ritesh-mishraa/GupShupAI.git

cd GupShupAI

## 2. Setup Backend:

cd backend
```bash
npm install
# Create .env file (see backend/README.md)
npm start
```

## 3. Setup Frontend:

cd frontend
```bash
npm install
npmrun dev
```

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.