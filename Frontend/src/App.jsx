import './App.css'
import SideBar from './SideBar.jsx'
import ChatArea from './ChatWindow.jsx'
import Login from './login.jsx' 
import Signup from './signup.jsx' 
import { MyContext } from './MyContext.jsx'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import React from "react"
import { Routes, Route } from "react-router-dom" // Import Routes and Route

function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState('null');
  const [currThreadId, setCurrThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads
  };

  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
        <Routes>
          <Route path="/" element={<><SideBar /><ChatArea /></>} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/signup" element={<Signup />} /> 
        </Routes>
      </MyContext.Provider>
    </div>
  )
}

export default App
