import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Code, ShieldAlert } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getScanSession } from '../services/scanSession';
import { generateFixWithGuardian, chatWithGuardian } from '../services/scanService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'code' | 'violation';
}

export function CopilotPage() {
  const [session, setSession] = useState(getScanSession());
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello. I am the Consent Guardian AI Copilot. I have analyzed ${session?.scanResult?.projectName || 'your repository'} and found ${session?.scanResult?.totalIssues || 0} issues. How can I assist you with privacy engineering today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const currentSession = getScanSession();
      const issues = currentSession?.scanResult?.issues || [];

      // Forward request to AI chat API
      const reply = await chatWithGuardian(userMsg.content, messages, issues);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply
      }]);
      
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error communicating with the AI Engine: ${err.message}`
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 mb-6 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white">AI Privacy Copilot</h1>
        <p className="text-muted-foreground">Chat with your repository's privacy intelligence agent.</p>
      </div>

      <div className="flex-1 bg-card/40 backdrop-blur-xl border border-white/5 rounded-2xl flex flex-col overflow-hidden relative shadow-2xl">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                msg.role === 'user' ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              
              <div className={cn(
                "max-w-[80%] rounded-2xl p-4",
                msg.role === 'user' ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-100" : "bg-white/5 border border-white/10 text-gray-200"
              )}>
                {msg.type === 'code' ? (
                  <div className="space-y-3">
                    <p>{msg.content.split('```')[0]}</p>
                    <div className="bg-black/80 border border-white/10 rounded-lg p-4 font-mono text-sm text-green-400 overflow-x-auto">
                      <pre>{msg.content.split('```')[1]?.replace('typescript\n', '')}</pre>
                    </div>
                  </div>
                ) : msg.type === 'violation' ? (
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p>{msg.content}</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-1.5 h-[52px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/40">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about GDPR violations, data flows, or request remediation code..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 rounded-lg bg-indigo-500 text-white disabled:opacity-50 hover:bg-indigo-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar">
            {["Show GDPR violations", "What personal data leaves the application?", "Generate fix for tracking consent"].map((suggestion) => (
              <button 
                key={suggestion}
                type="button"
                onClick={() => setInput(suggestion)}
                className="whitespace-nowrap text-xs text-gray-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-full px-3 py-1.5 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
