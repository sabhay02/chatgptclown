import './App.css';
import gptlogo from './assets/chatgpt.svg';
import addbtn from './assets/add-30.png';
import msgicon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendimg from './assets/send.svg';
import usericon from './assets/user-icon.png';
import gpt from './assets/chatgptLogo.svg';
import { useState,useRef,useEffect } from 'react';
import axios from "axios";

function App() {
  const messagesEndRef = useRef(null);
  


  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "ChatGPT is an advanced language model developed by OpenAI that uses artificial intelligence to understand and generate human-like text. It is based on the GPT (Generative Pre-trained Transformer) architecture and is designed to assist with a wide range of tasks..."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: input }]);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.cohere.ai/v1/generate",
        {
          model: "command",
          prompt: input,
          max_tokens: 300,
          temperature: 0.7,
          k: 0,
          p: 0.75,
          stop_sequences: [],
          return_likelihoods: "NONE"
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`, 
            "Content-Type": "application/json"
          }
        }
      );

      const generatedText = response.data.generations[0].text.trim();

      setMessages(prev => [...prev, { from: "bot", text: generatedText }]);
    } catch (err) {
      console.error("Cohere API error:", err.response ? err.response.data : err);
      setMessages(prev => [...prev, { from: "bot", text: "Error generating response." }]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuery = async (e) => {
  const query = e.target.value;
  if (!query) return;

  setMessages(prev => [...prev, { from: "user", text: query }]);
  setIsLoading(true);

  try {
    const response = await axios.post(
      "https://api.cohere.ai/v1/generate",
      {
        model: "command",
        prompt: query,
        max_tokens: 300,
        temperature: 0.7,
        k: 0,
        p: 0.75,
        stop_sequences: [],
        return_likelihoods: "NONE"
      },
      {
        headers: {
            "Authorization": `Bearer ${process.env.REACT_APP_COHERE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const generatedText = response.data.generations[0].text.trim();
    setMessages(prev => [...prev, { from: "bot", text: generatedText }]);
  } catch (err) {
    console.error("Cohere API error:", err.response ? err.response.data : err);
    setMessages(prev => [...prev, { from: "bot", text: "Error generating response." }]);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="App">
      <div className='sidebar'>
        <div className='upperside'>
          <div className='uppersidetop'>
            <img src={gptlogo} alt='logo' className='logo' />
            <span className='brand'>CHAT GPT</span>
          </div>
          <button className='midBtn' onClick={()=>{window.location.reload()}}>
            <img src={addbtn} alt='new chat' className='addBtn' />
            New Chat
          </button>
          <div className='uppersidebottom'>
            <button className='query' onClick={handleQuery} value={"What is Programming ?"}><img src={msgicon} alt='query' />What is Programming ?</button>
            <button className='query'onClick={handleQuery} value={">How to use an Api"}><img src={msgicon} alt='query' />How to use an Api</button>
          </div>
        </div>
        <div className='lowerside'>
          <div className='listitems'><img src={home} alt='Home' className='listitemsimg' />Home</div>
          <div className='listitems'><img src={saved} alt='Saved' className='listitemsimg' />Saved</div>
          <div className='listitems'><img src={rocket} alt='Upgrade' className='listitemsimg' />Upgrade to Pro</div>
        </div>
      </div>

      <div className='main'>
        <div className='chats'>
          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.from === "bot" ? "bot" : ""}`}>
              <img
                src={msg.from === "bot" ? gpt : usericon}
                className='chatimg'
                alt={msg.from === "bot" ? "bot" : "user"}
              />
              <p className='txt'>{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="chat bot">
              <img src={gpt} className='chatimg' alt='bot' />
              <p className='txt'>Typing...</p>
            </div>
          )}
          {/* Scroll target */}
  <div ref={messagesEndRef} />
        </div>

        <div className='chatFooter'>
          <div className='inp'>
            <input
              type='text'
              placeholder='Send a message...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button className='send' onClick={handleSend} disabled={isLoading}>
              <img src={sendimg} alt='Send' />
            </button>
          </div>
          <p>ChatGPT may produce inaccurate information about people, places, or facts. ChatGPT May 20 version</p>
        </div>
      </div>
    </div>
  );
}

export default App;
