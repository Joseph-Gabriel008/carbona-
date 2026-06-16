'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  Send, 
  Trash2, 
  User, 
  AlertTriangle 
} from 'lucide-react';
import { useCarbonaStore } from '@/lib/store';

const SUGGESTIONS = [
  'How can I reduce my footprint?',
  'Analyze my carbon score.',
  'What habits should I improve?',
  'Suggest eco-friendly alternatives.'
];

export default function CoachClient() {
  const { 
    emissions, 
    twin, 
    level, 
    xp, 
    completedChallenges, 
    coachHistory, 
    addCoachMessage, 
    clearCoachHistory 
  } = useCarbonaStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coachHistory, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setError(null);
    setInput('');
    addCoachMessage('user', text);
    setLoading(true);

    try {
      const currentMessages = [...coachHistory, { role: 'user', text }];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentMessages,
          context: {
            emissions,
            twin,
            gamification: {
              level,
              xp,
              completedChallenges
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('API server returned an error state');
      }

      const data = await response.json();
      if (data.text) {
        addCoachMessage('model', data.text);
      }
    } catch (err) {
      console.error(err);
      setError('Connection with Eco failed. Please check your setup or try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-6rem)] border border-border/80 bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm select-none">
      <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-brand-emerald/10 dark:bg-brand-emerald/20 text-brand-emerald flex items-center justify-center rounded-xl relative">
            <Bot className="h-5 w-5" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-card" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Coach Eco
              <span className="inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-bold text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/10">
                Active AI
              </span>
            </h2>
            <p className="text-[10px] text-muted-foreground font-semibold">
              Sustainability advisor synced to your emissions
            </p>
          </div>
        </div>

        <button
          onClick={clearCoachHistory}
          disabled={coachHistory.length === 0}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-background border border-border/80 hover:border-destructive/30 text-muted-foreground hover:text-destructive transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset chat log"
          aria-label="Reset chat log"
        >
          <Trash2 className="h-4.5 w-4.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {coachHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
            <div className="h-12 w-12 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Ask Coach Eco</h3>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Receive personalized action plans, carbon score diagnostics, and advice on sustainability habits.
              </p>
            </div>
          </div>
        ) : (
          coachHistory.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div 
                key={index}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${
                  isUser 
                    ? 'bg-brand-emerald text-white' 
                    : 'bg-muted border border-border/80 text-brand-emerald'
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-1">
                  <div className={`px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed ${
                    isUser 
                      ? 'bg-brand-emerald text-white rounded-tr-none whitespace-pre-line' 
                      : 'bg-muted/70 text-foreground border border-border/40 rounded-tl-none'
                  }`}>
                    {isUser ? (
                      msg.text
                    ) : (
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-sm font-extrabold mt-2 mb-1">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xs font-extrabold mt-2 mb-1">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xs font-bold mt-2 mb-1">{children}</h3>,
                          p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 mb-1.5">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 mb-1.5">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          code: ({ children }) => <code className="bg-background/50 px-1 py-0.5 rounded text-[10px] font-mono">{children}</code>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    )}
                  </div>
                  <span className={`text-[8px] text-muted-foreground font-bold block ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="h-8 w-8 rounded-full bg-muted border border-border/80 text-brand-emerald flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="px-4 py-3 bg-muted/50 rounded-2xl rounded-tl-none border border-border/40 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-brand-emerald/60 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-brand-emerald/60 animate-bounce [animation-delay:0.2s]" />
              <span className="h-2 w-2 rounded-full bg-brand-emerald/60 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-xs font-semibold flex items-center gap-2.5 max-w-md mx-auto">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-border/80 p-4 bg-muted/10 space-y-4">
        {coachHistory.length === 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug)}
                className="px-3 py-1.5 rounded-xl text-[10px] font-bold border border-border/80 bg-background hover:border-brand-emerald/40 hover:bg-brand-emerald/5 transition-all text-muted-foreground hover:text-brand-emerald cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Eco about reducing your carbon footprint..."
            disabled={loading}
            className="flex-1 h-11 px-4 text-xs font-semibold rounded-xl border border-border/80 bg-background/50 focus:border-brand-emerald outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
            title="Send message"
            className="h-11 w-11 rounded-xl bg-brand-emerald hover:bg-brand-emerald/95 text-white flex items-center justify-center shrink-0 shadow-md shadow-brand-emerald/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
