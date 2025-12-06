
//import React, { useContext, useState, useEffect} from "react";
// import "./chatWindow.css";
// import Chat from "./chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import {ScaleLoader} from 'react-spinners';

// function ChatArea() {
//   const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
//   const [loading, setLoading] = useState(false);

//   const [isOpen, setIsOpen] = useState(false);

//   const getreply= async()=> {
//     setLoading(true);
//     setNewChat(false);
//     const options = {
//       method: 'POST',
//       headers: {
//         "content-type": "application/json"
//       },
//       body: JSON.stringify({
//         message: prompt,
//         threadId: currThreadId 
//       })
//     };

//     try {
//       const response = await fetch('http://localhost:8000/api/chat', options);
//       const reply = await response.json();
//       // console.log("Response received: ", response);
//       console.log("Response received: ", reply);
//       setReply(reply.reply);
//     }catch (err){
//       console.log("Error fetching reply: ", err);
//     }
//     setLoading(false);
//   }

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.reload();
//   }

//   useEffect(()=> {
//     if(prompt && reply) {
//       setPrevChats( prevChats => ([...prevChats, {
//         role: 'user',
//         content: prompt
//       },{
//         role: 'assistant',
//         content: reply
//       }
//       ]));
//     }
//     setPrompt('');
//   }, [reply]);

//   const handleProfileClick = () => {
//     setIsOpen(!isOpen);
//   }

//   return (
//     <div className="chatWindow">
//       <div className="navbar">
//         <span>
//           GupShupAI &nbsp; <i className="fa-solid fa-chevron-down"></i>
//         </span>
//         <div className="userIcon" onClick={handleProfileClick}>
//           <span className="icon">
//             <i className="fa-solid fa-user"></i>
//           </span>
//         </div>
//       </div>
//       {
//         isOpen && 
//         <div className="dropDown">
//           <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan</div>
//           <div className="dropDownItem"><i className="fa-solid fa-gear"></i>Settings</div>
//           <div className="dropDownItem" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i>Logout</div>
//         </div>

//       }
//       <Chat></Chat>
//     <ScaleLoader color="#fff" loading={loading} className="loader" >
//     </ScaleLoader>
//       <div className="chatInput">
//         <div className="inputBox">
//           <input placeholder="Ask Anything" value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter"? getreply() : ''}>
//           </input>
//           <div id="submit" onClick={getreply}>
//             <i className="fa-solid fa-paper-plane"></i>
//           </div>
//         </div>

//         <div className="info-box">
//           GupShupAI can make mistakes. Please verify critical information from
//           reliable sources.
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatArea;



import React, { useContext, useState, useEffect, useRef } from "react";
import "./chatWindow.css";
import Chat from "./chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";

function ChatArea() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
    setCurrThreadId,
    allThreads,
    setAllThreads,
  } = useContext(MyContext);
  
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const getreply = async () => {
    if (!prompt.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in to send a message.");
        return;
    }

    setLoading(true);
    setNewChat(false);

    const currentMessage = prompt;
    const threadIdToSend = currThreadId;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:8000/api/chat", options);
      
      if (response.status === 401) {
          console.error("Unauthorized: Please login again.");
          return;
      }

      const replyData = await response.json();
      console.log("Response received: ", replyData);
      
      // Make sure we set the specific text reply
      setReply(replyData.reply); 

      const activeId = threadIdToSend || replyData.threadId;

      if (!currThreadId) {
          setCurrThreadId(activeId);
      }

      // Reorder Sidebar: Remove current thread -> Add to Top
      setAllThreads(prevThreads => {
        //  Remove the thread from the old list
        const filteredList = prevThreads.filter(t => t.threadId !== activeId);
        const existingThread = prevThreads.find(t => t.threadId === activeId);
        const titleToUse = existingThread ? existingThread.title : currentMessage.slice(0, 30);

        const topThread = {
            threadId: activeId,
            title: titleToUse
        };
        return [topThread, ...filteredList];
      });

    } catch (err) {
      console.log("Error fetching reply: ", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    // 1. Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Your browser does not support voice input. Try Chrome.");
      return;
    }

    if (isListening) {
      // STOP LISTENING
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      // START LISTENING
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US"; // Set language
      recognition.interimResults = false; // Only get final result
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        // Append to existing text or replace it
        setPrompt((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech error:", event.error);
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // Update the Chat List when a new Reply arrives
  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((currentChats) => {
        const newMessages = [
          { role: "user", content: prompt },
          { role: "assistant", content: reply },
        ];

        if (Array.isArray(currentChats)) {
            return [...currentChats, ...newMessages];
        } else if (currentChats && Array.isArray(currentChats.messages)) {
            // If it's an object with .messages (like from MongoDB), update the internal array
            return {
                ...currentChats,
                messages: [...currentChats.messages, ...newMessages]
            };
        } else {
            return newMessages;
        }
      });
      setPrompt(""); 
    }
  }, [reply]);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  // Handle Enter Key press
  const handleKeyDown = (e) => {
      if (e.key === "Enter") {
          e.preventDefault(); // Stop default newline behavior
          getreply();
      }
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          GupShupAI
        </span>
        <div className="userIcon" onClick={handleProfileClick}>
          <span className="icon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem" onClick={handleLogout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
          </div>
        </div>
    
      )}

      {/* The Chat Component handles displaying the list */}
      <Chat />

      <ScaleLoader color="#fff" loading={loading} className="loader" />

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown} 
          />
          
          <div id="mic"
          onClick={toggleListening}
          className={isListening ? "mic-active" : ""}
          title="Voice Input">
            <i className={`fa-solid ${isListening ? "fa-microphone-slash" : "fa-microphone"}`}></i>
          </div>

          <div id="submit" onClick={getreply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <div className="info-box">
          GupShupAI can make mistakes. Please verify critical information from
          reliable sources.
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
