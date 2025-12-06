import "./chat.css";
import { use, useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

export default function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  // console.log("prevChats type:", typeof prevChats);
  // console.log("prevChats value:", prevChats);

  let safePrevChats = [];
  
  if (Array.isArray(prevChats)) {
    safePrevChats = prevChats;
  } else if (prevChats && Array.isArray(prevChats.messages)) {
    safePrevChats = prevChats.messages;
  }

  useEffect(() => {
    if (reply == null) {
      setLatestReply(null);
      return;
    }

    if (!safePrevChats?.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat && <h1>Start a new Chat!</h1>}

      <div className="chats">
        {safePrevChats?.slice(0, -1).map((Chat, index) => (
          <div
            className={Chat.role === "user" ? "userDiv" : "geminiDiv"}
            key={index}
          >
            {Chat.role === "user" ? (
              <p className="userMessage">{Chat.content}</p>
            ) : (
              <div className="geminiMessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {Chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}
        {safePrevChats.length > 0 && latestReply != null && (
          <div className="geminiMessage" key={"typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply}
            </ReactMarkdown>
          </div>
        )}
        {safePrevChats.length > 0 && latestReply === null && (
          <div className="geminiMessage" key={"non-typing"}>
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {safePrevChats[safePrevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </>
  );
}
