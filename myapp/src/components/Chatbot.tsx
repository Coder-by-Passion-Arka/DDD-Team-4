import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Type for the expected OpenRouter API response
type OpenRouterResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load your API key from .env file (VITE_OPENROUTER_API_KEY=your_key)
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { user: userMessage, bot: '...' }]);
    setInput('');
    console.log("API KEY:", apiKey);
    try {
      const response = await axios.post<OpenRouterResponse>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [{ role: 'user', content: userMessage }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5173',
            'X-Title': 'EvalPeer Chatbot',
          },
        }
      );

      const botReply = response.data.choices[0].message.content;
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = botReply;
        return updated;
      });
    } catch (error: unknown) {
  let errorMessage = 'Unknown error';
  if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = (error as { message: string }).message;
  }

  console.error('❌ Error fetching response:', error);
  setMessages((prev) => {
    const updated = [...prev];
    updated[updated.length - 1].bot = '⚠️ Failed to fetch: ' + errorMessage;
    return updated;
  });
}
  };

  return (
    <div className="ml-64 min-h-screen bg-gradient-to-b from-indigo-50 to-white p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Chatbot Assistant</h2>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 max-w-3xl h-[70vh] overflow-y-auto space-y-6">
        {messages.map((m, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-end">
              <div className="bg-blue-100 text-blue-900 px-4 py-2 rounded-lg max-w-xs text-right">
                {m.user}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-xs">
                {m.bot}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="max-w-3xl mt-6 flex">
        <input
          className="flex-grow px-4 py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-r-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
