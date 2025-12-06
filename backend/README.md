Filename: `backend/README.md`

```markdown
# 🔙 GupShupAI - Backend

The server-side application for GupShupAI, handling API requests, database connections, and communication with Google Gemini.

## ⚙️ Configuration

Create a file named `.env` in the `backend` folder and add the following variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_string
GEMINI_API_KEY=your_google_gemini_api_key

🏃‍♂️ Running the Server

# Install dependencies :- 
npm install

#Start the server :-
npm start
# OR if using nodemon
    npm run dev
```

The server will run at http://localhost:8000.

## 📚 API Endpoints 

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/chats` - Fetch user chat history
- `POST /api/chats` - Save a new chat message
- `GET /api/thread` - Fetch specific chat thread for logged in user
- `GET /api/thread/:id` - Fetch a specific message in a chat thread by ID
- `DELETE /api/thread/:id` - Delete a specific chat thread by ID

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- Google Gemini SDK (`@google/generative-ai`)

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
```