
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AppModule } from '../types';
import { createChatSession, sendMessageToGemini } from '../services/gemini';
import { Chat } from '@google/genai';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Props {
  module: AppModule;
}

const getModuleTopic = (module: AppModule) => {
  switch (module) {
    case AppModule.DFA: return 'Deterministic Finite Automata (DFAs)';
    case AppModule.NFA: return 'Nondeterministic Finite Automata (NFAs)';
    case AppModule.PDA: return 'Pushdown Automata (PDAs)';
    case AppModule.NFA_TO_DFA: return 'NFA to DFA Conversion';
    case AppModule.TM: return 'Turing Machines';
    case AppModule.PNP: return 'Complexity Theory (P vs NP)';
    default: return 'Theory of Computing';
  }
};

const ChatAssistant: React.FC<Props> = ({ module }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: `Hello! I am Professor Automata. Ask me anything about ${getModuleTopic(module)}!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Re-initialize chat when module changes
  useEffect(() => {
    chatSessionRef.current = createChatSession(module);
    setMessages([{
        id: Date.now().toString(),
        role: 'model',
        text: `Hello! I am Professor Automata. Ask me anything about ${getModuleTopic(module)}!`,
        timestamp: new Date()
    }]);
  }, [module]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await sendMessageToGemini(chatSessionRef.current, userMsg.text);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-slate-700">AI Assistant ({module})</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-hide">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-3 rounded-lg text-sm max-w-[85%] shadow-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.text.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-10">
            <div className="animate-bounce">●</div>
            <div className="animate-bounce delay-75">●</div>
            <div className="animate-bounce delay-150">●</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask about ${module} theory...`}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
