
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from './types';
import { analyzeMessage } from './services/geminiService';
import ChatBubble from './components/ChatBubble';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: 'greeting',
      sender: 'friend',
      text: "Hey bestie! I'm here to listen. Tell me anything, and I'll tell you if I think you're being for real or just being a little silly! ✨",
      reason: "I'm so excited to hear your stories! ✨",
      verdict: 'Truthful',
      timestamp: Date.now()
    };
    setMessages([greeting]);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const result = await analyzeMessage(userMessage.text);
      
      const friendResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'friend',
        text: '', // Text is empty as per instructions we use verdict + reason
        verdict: result.verdict,
        reason: result.reason,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, friendResponse]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-white shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="bg-pink-500 p-6 text-white shadow-md flex items-center gap-4 z-10">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl shadow-inner animate-bounce">
          😊
        </div>
        <div>
          <h1 className="text-xl font-bold">Bestie's Truth Hub</h1>
          <p className="text-xs text-pink-100 opacity-90">Always here to listen, never to judge!</p>
        </div>
      </header>

      {/* Chat Area */}
      <main 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 chat-container bg-[#fffafb] scroll-smooth"
      >
        <div className="flex flex-col pb-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="max-w-[70%] rounded-2xl rounded-tl-none p-4 shimmer border border-pink-100 shadow-sm">
                <div className="h-4 w-32 bg-pink-100 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-48 bg-pink-50 rounded animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 bg-white border-t border-pink-50 sticky bottom-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tell me a story, bestie..."
            className="flex-1 p-3 bg-pink-50 border border-pink-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all text-slate-700 placeholder-pink-300"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-200 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>
        <p className="text-[10px] text-center mt-2 text-slate-400 font-medium">
          I'm just guessing based on my feelings! No hard feelings, okay? 💖
        </p>
      </footer>
    </div>
  );
};

export default App;
