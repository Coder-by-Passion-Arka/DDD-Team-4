import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct', // ✅ Correct model name
          messages: [
            { role: 'system', content: 'You are a helpful assistant for the BookHive app.' },
            { role: 'user', content: userText }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer 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`, // 🔁 Replace this with your actual key
            'Content-Type': 'application/json'
          }
        }
      );

      const botReply = response.data.choices?.[0]?.message?.content || 'No response.';
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h3>📚 BookHive Chatbot</h3>
      <div style={{
        height: 300,
        overflowY: 'auto',
        padding: 10,
        border: '1px solid #ccc',
        background: '#f9f9f9',
        borderRadius: '8px'
      }}>
        {messages.map((msg, idx) => (
          <p key={idx} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You' : 'Bot'}:</strong> {msg.text}
          </p>
        ))}
        {loading && <p><em>Bot is typing...</em></p>}
      </div>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 5 }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
