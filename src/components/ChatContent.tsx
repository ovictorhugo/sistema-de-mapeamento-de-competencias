import { ChartLine, LinkBreak, PaperPlaneTilt, Question } from "phosphor-react";
import { Logo } from "./Logo";
import {SearchChat} from "./SearchChat";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/context";
import { Pesquisadores } from "./Pesquisadores";
import { Header } from "./Header";

const API_KEY = "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";

export function ChatContent() {
    const { valoresSelecionadosExport, setValoresSelecionadosExport } = useContext(UserContext);
    const [inputMessage, setInputMessage] = useState('');
    const [messages, setMessages] = useState([
      {
        message: "Hello! How can I help you today?",
        sender: "ChatGPT",
        direction: "incoming"
      }
    ]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function processMessageToChatGPT(chatMessages: any) {
            const apiMessages = chatMessages.map((messageObject: any) => ({
              role: messageObject.sender === "ChatGPT" ? "assistant" : "user",
              content: messageObject.message
            }));
          
            const systemMessage = {
              role: "system",
              content: "Explain all concepts like I am 10 years old"
            };
          
            const apiRequestBody = {
              model: "gpt-3.5-turbo",
              messages: [systemMessage, ...apiMessages]
            };
          
            try {
              const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${API_KEY}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
              });
          
              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error response from OpenAI API: ${errorData.error.message}`);
              }
          
              const data = await response.json();
              const assistantMessage = data.choices[0]?.message?.content;
          
              if (!assistantMessage) {
                console.error("Unexpected response from OpenAI API:", data);
                throw new Error("Unexpected response from OpenAI API");
              }
          
              handleReceivedMessage(assistantMessage, "ChatGPT");
            } catch (error) {
              console.error("Error processing message to ChatGPT:", error.message);
              throw error; // Re-throw the error to allow proper handling in the calling function
            }
          }

        processMessageToChatGPT(messages);
      }, []);
  
   
      const handleSend = async () => {
        const newMessage = {
          message: inputMessage,
          sender: "user",
          direction: "outgoing"
        };
    
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInputMessage('');
        setLoading(true);
    
        try {
          await processMessageToChatGPT(newMessages);
        } catch (error) {
          console.error("Error processing message to ChatGPT:", error);
        } finally {
          setLoading(false);
        }
      };
      
  
    const handleReceivedMessage = (content: any, sender: any) => {
      const newMessage = {
        message: content,
        sender: sender,
        direction: "incoming"
      };
  
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
    };
  
    return (
      <div className="h-screen">
        <div className="py-24 px-16 w-full">
          <div>
            <div>
              {messages.map((message, i) => (
                <div key={i} className={message.direction === "incoming" ? "text-blue-600" : "text-green-600"}>
                  {message.message}
                </div>
              ))}
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="button" onClick={handleSend} disabled={loading}>
                Send
              </button>
            </form>
            {loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
    );
  }