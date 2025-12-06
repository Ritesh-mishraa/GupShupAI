Filename: `frontend/README.md`

```markdownmarkdown
# 💬 GupShupAI - Frontend

The user interface for GupShupAI, built with React. It manages user state, handles voice input, and renders chat history with syntax highlighting.

## 📦 Installation

Install Dependencies:
    ```bash
    npm install

## 🏃‍♂️ Running the App
    ```bash
    npm start
    # OR if using Vite
    npm run dev
    ```
The app will run at http://localhost:3000 (or http://localhost:5173 for Vite).

## 🛠️ Tech Stack
- React.js
- Context API
- CSS3
- React Router
- Web Speech API
- react-syntax-highlighter
- react-typing-effect

🧩 Key Components
- ChatArea.jsx: The main chat window containing the input box, voice toggle, and message rendering.

- SideBar.jsx: Manages the list of chat history and new chat creation.

- Signup/Login.jsx: Handles user authentication and redirects.

- MyContext.jsx: Global state management for themes, user data, and chat lists.

🎙️ Voice Input Note
The voice input feature uses the Web Speech API, which is supported in most modern browsers. Ensure your browser has microphone access enabled for this feature to work.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
