
import React from 'react';
import { ChatMessage, Verdict } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

const getVerdictColors = (verdict?: Verdict) => {
  switch (verdict) {
    case 'Truthful': return 'bg-green-50 border-green-200 text-green-800';
    case 'Sounds Suspicious': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'Probably a Lie': return 'bg-red-50 border-red-200 text-red-800';
    default: return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm border ${
        isUser 
          ? 'bg-pink-500 text-white rounded-tr-none' 
          : 'bg-white text-slate-800 rounded-tl-none border-pink-100'
      }`}>
        {isUser ? (
          <p className="text-sm md:text-base leading-relaxed">{message.text}</p>
        ) : (
          <div className="space-y-3">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getVerdictColors(message.verdict)}`}>
              {message.verdict}
            </div>
            <p className="text-sm md:text-base leading-relaxed italic">
              "{message.reason}"
            </p>
          </div>
        )}
        <div className={`text-[10px] mt-1 ${isUser ? 'text-pink-100' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
