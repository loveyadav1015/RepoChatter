import { useState, useRef, useEffect } from 'react';
import { chat } from '../services/api';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import ChatMessage from './ChatMessage';
import { useLocalGlow } from '../hooks/useLocalGlow';
import { Send } from 'lucide-react';

export default function ChatWindow({ repoId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { ref, onMouseMove } = useLocalGlow();

  useEffect(() => {
    if (scrollRef.current) {
      const scrollViewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userQuestion = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setLoading(true);

    try {
      const res = await chat.ask(repoId, userQuestion);
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: res.data.answer,
          sources: res.data.sourceChunkTexts || []
        }
      ]);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to get answer');
      // Remove the optimistic user message on failure so they can try again if they want
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-bg border border-border rounded-xl overflow-hidden relative">
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex items-start mb-6">
              <div className="bg-card border border-border text-foreground px-4 py-3 rounded-2xl rounded-tl-sm max-w-[85%]">
                <div className="flex gap-1 items-center h-5">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 bg-card border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center max-w-3xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the codebase..."
            disabled={loading}
            className="flex-1 bg-background border-border text-foreground focus:ring-glow"
          />
          <div ref={ref} onMouseMove={onMouseMove} className="glow-on-hover rounded-md shrink-0">
            <Button 
              type="submit" 
              size="icon"
              disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
