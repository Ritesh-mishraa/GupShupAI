// import "./sideBar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v4 as uuidv4 } from "uuid";

// export default function SideBar() {
//   const {
//     allThreads,
//     setAllThreads,
//     currThreadId,
//     setNewChat,
//     setPrompt,
//     setReply,
//     setCurrThreadId,
//     setPrevChats,
//   } = useContext(MyContext);

//   const getAllThreads = async () => {
//     try {
//       const response = await fetch("http://localhost:8000/api/thread");
//       const res = await response.json();
//       const filteredData = res.map((thread) => ({
//         threadId: thread.threadId,
//         title: thread.title,
//       }));
//       // console.log("Fetched Threads: ", filteredData);
//       setAllThreads(filteredData);
//     } catch (e) {
//       console.log("Error fetching threads: ", e);
//     }
//   };

//   useEffect(() => {
//     getAllThreads();
//   }, [currThreadId]);

//   const createNewChat = () => {
//     setNewChat(true);
//     setPrompt("");
//     setReply(null);
//     setCurrThreadId(uuidv4());
//     setPrevChats([]);
//   };

//   const changeThread = async (newthreadId) => {
//     setCurrThreadId(newthreadId);
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/thread/${newthreadId}`
//       );
//       const res = await response.json();
//       console.log(res);
//       setPrevChats(res);
//       setNewChat(false);
//       setReply(null);
//     } catch (e) {
//       console.log("Error changing thread: ", e);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

//   const deleteThread = async (threadId) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/thread/${threadId}`,
//         {
//           method: "DELETE",
//         }
//       );
//       const res = await response.json();
//       // console.log("Delete Response: ", res);
//       setAllThreads((prev) =>
//         prev.filter((thread) => thread.threadId !== threadId)
//       );

//       if (threadId === currThreadId) {
//         // If the deleted thread is the current thread, create a new chat
//         createNewChat();
//       }
//     } catch (e) {
//       console.log("Error deleting thread: ", e);
//     }
//   };

//   return (
//     <section className="sidebar">
//       <button onClick={createNewChat}>
//         <img src="src/assets/logo.png" alt="logo" className="logo"></img>
//         <span>
//           <i className="fa-solid fa-pen-to-square"></i>
//         </span>
//       </button>

//       <ul className="history">
//         {allThreads.map((thread, index) => (
//           <li
//             key={index}
//             onClick={() => changeThread(thread.threadId)}
//             // className={thread.threadId === currThreadId ? "active" : ""}
//             className={thread.threadId === currThreadId ? "highlighted" : ""}
//           >
//             <span>
//               <i className="fa-solid fa-message"></i>
//             </span>
//             {thread.title}
//             <i
//               className="fa-solid fa-trash"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 deleteThread(thread.threadId);
//               }}
//             ></i>
//           </li>
//         ))}
//       </ul>

//       <div className="sign">
//         <p>By Ritesh Mishra &hearts;</p>
//       </div>
//     </section>
// }





// import "./sideBar.css";
// import { useContext, useEffect, useState } from "react";
// import { MyContext } from "./MyContext.jsx";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";
// import User from "../../backend/models/User.js";

// export default function SideBar() {
//   const {
//     allThreads,
//     setAllThreads,
//     currThreadId,
//     setNewChat,
//     setPrompt,
//     setReply,
//     setCurrThreadId,
//     setPrevChats,
//   } = useContext(MyContext);

//   const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
//   const navigate = useNavigate();

//   const getAllThreads = async () => {
//     console.log("Fetching threads...");
//     const token = localStorage.getItem("token"); // Check for token
//     if (!token) {
//       setIsLoggedIn(false); // User is not logged in
//       console.log("No token found. User is not logged in.");
//       return;
//     }

//     setIsLoggedIn(true); 
//     try {
//       const response = await fetch("http://localhost:8000/api/thread", {
//         headers: {
//           Authorization: `Bearer ${token}`, 
//         },
//       });
//       const res = await response.json();
//       const filteredData = res.map((thread) => ({
//         threadId: thread.threadId,
//         title: thread.title
//       }));
//       console.log("Fetched Threads:", filteredData);
//       setAllThreads(filteredData);
//     } catch (e) {
//       console.log("Error fetching threads: ", e);
//     }
//   };

//   useEffect(() => {
//     getAllThreads();
//   }, []);

//   const createNewChat = () => {
//     //console.log("Creating new chat...");
//     setNewChat(true);
//     setPrompt("");
//     setReply(null);
//     setCurrThreadId(uuidv4());
//     setPrevChats([]);
//   };

//   const changeThread = async (newthreadId) => {
//     setCurrThreadId(newthreadId);
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/thread/${newthreadId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           }
//         }
//       );
//       const res = await response.json();
//       console.log("res:", res);
//       setPrevChats(res);
//       setCurrThreadId(newthreadId);
//       setNewChat(false);
//       setReply(null);
//     } catch (e) {
//       console.log("Error changing thread: ", e);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };

//   const deleteThread = async (threadId) => {
//     const token = localStorage.getItem("token");
//     if (!token) return;

//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/thread/${threadId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const res = await response.json();
//       setAllThreads((prev) =>
//         prev.filter((thread) => thread.threadId !== threadId)
//       );

//       if (threadId === currThreadId) {
//         createNewChat();
//       }
//     } catch (e) {
//       console.log("Error deleting thread: ", e);
//     }
//   };

//   const handleLoginRedirect = () => {
//     navigate("/login");
//   };

//   const handleSignupRedirect = () => {
//     navigate("/signup");
//     navigate("/signup");
//   };

//   const handleLogout = () => {
//     console.log("Logging out...");
//     localStorage.removeItem("token"); // Remove token
//     setIsLoggedIn(false); // Update login status
//     setAllThreads([]); // Clear threads
//     setPrevChats([]); // Clear previous chats
//     setNewChat(true); // Reset to new chat state
//     setPrompt("");
//     setReply(null);
//     setCurrThreadId(null);
//   };

//   return (
//     <section className="sidebar">
//       {isLoggedIn ? (
//         <>
//           <button onClick={createNewChat}>
//             <img src="/assets/logo.png" alt="logo" className="logo"></img>
//             <span>
//               <i className="fa-solid fa-pen-to-square"></i>
//             </span>
//           </button>

//           <ul className="history">
//             {allThreads.map((thread, index) => (
//               <li
//                 key={index}
//                 onClick={() => changeThread(thread.threadId)}
//                 className={
//                   thread.threadId === currThreadId ? "highlighted" : ""
//                 }
//               >
//                 <span>
//                   <i className="fa-solid fa-message"></i>
//                 </span>
//                 {thread.title}
//                 <i
//                   className="fa-solid fa-trash"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteThread(thread.threadId);
//                   }}
//                 ></i>
//               </li>
//             ))}
//           </ul>

//           <div className="sign">
//             <button onClick={handleLogout} className="logout-button">
//               Logout
//             </button>
//             <p>By Ritesh Mishra &hearts;</p>
//           </div>
//         </>
//       ) : (
//         <div className="auth-buttons">
//           <button onClick={handleLoginRedirect} className="login-button">
//             Login
//           </button>
//           <button onClick={handleSignupRedirect} className="signup-button">
//             Signup
//           </button>
//         </div>
//       )}
//     </section>
//   );
// }

import "./sideBar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
// import User from "../../backend/models/User.js"; // You cannot import Mongoose models in React. Remove this.

export default function SideBar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const getAllThreads = async () => {
    // console.log("Fetching threads...");
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsLoggedIn(false);
      // console.log("No token found. User is not logged in.");
      return;
    }

    setIsLoggedIn(true);
    
    try {
      const response = await fetch("http://localhost:8000/api/thread", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
          setIsLoggedIn(false);
          return;
      }

      const res = await response.json();
      
      // Safety check: ensure res is an array before mapping
      if (Array.isArray(res)) {
        const filteredData = res.map((thread) => ({
            threadId: thread.threadId,
            title: thread.title,
        }));
        // console.log("Fetched Threads:", filteredData);
        setAllThreads(filteredData);
      }
    } catch (e) {
      console.log("Error fetching threads: ", e);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChats([]); // Clear the main chat window
  };

  // === FIX IS HERE ===
  const changeThread = async (newthreadId) => {
    // 1. Get the token locally
    const token = localStorage.getItem("token"); 
    
    if (!token) return; // Stop if no token

    setCurrThreadId(newthreadId);
    
    try {
      const response = await fetch(
        `http://localhost:8000/api/thread/${newthreadId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 2. Now 'token' is defined
          },
        }
      );

      if (response.status === 401) {
         console.error("Unauthorized");
         return;
      }

      const res = await response.json();
      // console.log("res:", res);
      
      setPrevChats(res); // Updates the Main Chat Window
      setCurrThreadId(newthreadId);
      setNewChat(false);
      setReply(null); // Clear any pending typing effects
      
    } catch (e) {
      console.log("Error changing thread: ", e);
      // Removed res.status(500) because 'res' is not defined here and it's not backend code
    }
  };

  const deleteThread = async (threadId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/thread/${threadId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.ok) {
          setAllThreads((prev) =>
            prev.filter((thread) => thread.threadId !== threadId)
          );

          // If we deleted the active chat, reset to New Chat
          if (threadId === currThreadId) {
            createNewChat();
          }
      }
    } catch (e) {
      console.log("Error deleting thread: ", e);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    console.log("Logging out...");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAllThreads([]);
    setPrevChats([]);
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(null);
    // Optional: Refresh page to clear all states cleanly
    // window.location.reload(); 
  };

  return (
    <section className="sidebar">
      {isLoggedIn ? (
        <>
          <button onClick={createNewChat} className="new-chat-btn">
            <img src="/assets/logo.png" alt="logo" className="logo"></img>
            <span>New Chat</span>
            <i className="fa-solid fa-pen-to-square"></i>
          </button>

          <ul className="history">
            {allThreads.map((thread, index) => (
              <li
                key={index}
                onClick={() => changeThread(thread.threadId)}
                className={
                  thread.threadId === currThreadId ? "highlighted" : ""
                }
              >
                <div className="chat-title">
                    <span>
                    <i className="fa-solid fa-message"></i>
                    </span>
                    <span className="text-truncate">{thread.title}</span>
                
                
                <i
                  className="fa-solid fa-trash delete-icon"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    deleteThread(thread.threadId);
                  }}
                ></i>
                </div>
              </li>
            ))}
          </ul>

          <div className="sign">
            <button onClick={handleLogout} className="logout-button">
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
            <p className="footer-credits">By Ritesh Mishra &hearts;</p>
          </div>
        </>
      ) : (
        <div className="auth-buttons">
          <p>Welcome to GupShupAI</p>
          <button onClick={handleLoginRedirect} className="login-button">
            Login
          </button>
          <button onClick={handleSignupRedirect} className="signup-button">
            Signup
          </button>
        </div>
      )}
    </section>
  );
}
