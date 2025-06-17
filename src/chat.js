import './styles/chat.scss';
import React, { useState, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import cameraIcon from './assets/camera.png'; // <-- Import your PNG here

const socket = io('http://localhost:3000');

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    socket.on('message', msg => {
      setMessages(prev => [...prev, msg]);
    });
    return () => socket.off('message');
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const sendMessage = () => {
    if (messageText.trim() || image) {
      const messageObj = {
        type: 'combined',
        text: messageText,
        image: image,
      };

      socket.emit('message', messageObj);
      setMessages(prev => [...prev, messageObj]);
      setMessageText('');
      setImage(null);
    }
  };

  return (
    <div id='bg'>
    <div className='chat-message'>
      <div id='box' style={{  border: '0px solid #ccc', marginBottom: 20, overflowY: 'auto' }}>
        {messages.map((msg, idx) => {
          const getHighlightClass = (text = "") => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("alert")) return "chat-bubble alert";
  if (lowerText.includes("urgent")) return "chat-bubble urgent";
  if (lowerText.includes("important")) return "chat-bubble important";
  return "chat-bubble";
};


return (
  <div
    id='chats'
    key={idx}
    className={getHighlightClass(msg.text)}
  >
              {msg.text && <div>{msg.text}</div>}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="sent-img"
                  style={{ maxWidth: '200px', borderRadius: '8px', marginTop: msg.text ? 8 : 0 }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div id='centres'>
        <input
          id='space'
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />

        <button
          type="button"
          id="img-icon-btn"
          onClick={handleIconClick}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: 10,
            padding: 10,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Send Image"
        >
          <img src={cameraIcon} alt="camera" style={{ width: 24, height: 24 }} />
        </button>
        <button id='butt' onClick={sendMessage}>Send</button>
      </div>
      {/* Image preview before sending */}
     
    </div>
    </div>
  );
}

export default Chat;