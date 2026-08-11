import { useGsapReveal } from '../hooks/useGsapReveal';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export default function ChatMessage({ message }) {
  const ref = useGsapReveal('message');
  
  const isUser = message.role === 'user';

  return (
    <div ref={ref} className={`flex flex-col mb-6 ${isUser ? 'items-end' : 'items-start'}`}>
      <div 
        className={`max-w-[85%] px-4 py-3 rounded-2xl font-sans ${
          isUser 
            ? 'bg-primary text-primary-foreground rounded-tr-sm' 
            : 'bg-card border border-border text-foreground rounded-tl-sm'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {!isUser && message.sources?.length > 0 && (
          <details className="mt-4 text-sm group">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none">
              View Sources ({message.sources.length})
            </summary>
            <div className="mt-2 pt-2 border-t border-border">
              <ScrollArea className="h-40 w-full rounded-md">
                <div className="space-y-4">
                  {message.sources.map((text, i) => (
                    <div key={i} className="space-y-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        Source {i + 1}
                      </Badge>
                      <p className="text-muted-foreground text-xs leading-relaxed font-mono">
                        {text}
                      </p>
                      {i < message.sources.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
