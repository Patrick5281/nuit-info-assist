import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/i18n';
import { SearchResult } from '@/lib/tfidf';
import { 
  ExternalLink, 
  Database, 
  Cpu, 
  HardDrive,
  CheckCircle2,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  result?: SearchResult;
}

interface ChatMessageProps {
  message: Message;
  lang: Language;
  isLatest?: boolean;
}

export function ChatMessage({ message, lang, isLatest }: ChatMessageProps) {
  const t = translations[lang];
  const isUser = message.role === 'user';
  const isRTL = lang === 'ar';

  const getSourceIcon = () => {
    if (!message.result) return null;
    switch (message.result.source) {
      case 'cache': return <HardDrive className="w-3.5 h-3.5" />;
      case 'rule': return <Cpu className="w-3.5 h-3.5" />;
      case 'faq': return <Database className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getSourceLabel = () => {
    if (!message.result) return '';
    switch (message.result.source) {
      case 'cache': return t.cacheHit;
      case 'rule': return t.ruleMatch;
      case 'faq': return t.faqMatch;
      default: return '';
    }
  };

  const confidenceColor = (score: number) => {
    if (score >= 0.5) return 'bg-success text-success-foreground';
    if (score >= 0.3) return 'bg-warning text-warning-foreground';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div
      className={cn(
        "flex gap-3 w-full",
        isUser ? (isRTL ? "flex-row" : "flex-row-reverse") : (isRTL ? "flex-row-reverse" : "flex-row"),
        isLatest && "animate-slide-up"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
      )}>
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>

      {/* Message bubble */}
      <div className={cn(
        "flex flex-col gap-2 max-w-[80%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-card border border-border/50 shadow-sm rounded-tl-sm",
          isRTL && isUser && "rounded-tr-2xl rounded-tl-sm",
          isRTL && !isUser && "rounded-tl-2xl rounded-tr-sm"
        )}>
          <p className={cn(
            "text-sm leading-relaxed whitespace-pre-wrap",
            isRTL && "text-right"
          )}>
            {message.content}
          </p>
        </div>

        {/* Result metadata for assistant messages */}
        {!isUser && message.result && (
          <div className={cn(
            "flex flex-col gap-3 px-1",
            isRTL && "items-end"
          )}>
            {/* Source and confidence badges */}
            <div className={cn("flex items-center gap-2 flex-wrap", isRTL && "flex-row-reverse")}>
              <Badge variant="secondary" className="gap-1.5 text-xs font-normal">
                {getSourceIcon()}
                {getSourceLabel()}
              </Badge>
              <Badge className={cn("text-xs font-medium", confidenceColor(message.result.score))}>
                {t.confidenceLabel}: {Math.round(message.result.score * 100)}%
              </Badge>
              {message.result.item.category && (
                <Badge variant="outline" className="text-xs">
                  {t.category[message.result.item.category as keyof typeof t.category] || message.result.item.category}
                </Badge>
              )}
            </div>

            {/* Steps if available */}
            {message.result.item.steps && message.result.item.steps.length > 0 && (
              <div className={cn(
                "bg-accent/50 rounded-xl p-3 space-y-2",
                isRTL && "text-right"
              )}>
                <p className="text-xs font-semibold text-accent-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.stepsLabel}
                </p>
                <ol className={cn(
                  "space-y-1.5",
                  isRTL ? "pr-4" : "pl-4"
                )}>
                  {message.result.item.steps.map((step, i) => (
                    <li 
                      key={i} 
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Official link */}
            {message.result.item.link && (
              <a
                href={message.result.item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 text-xs text-primary hover:underline",
                  "bg-primary/5 px-3 py-2 rounded-lg transition-colors hover:bg-primary/10",
                  isRTL && "flex-row-reverse"
                )}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.linkLabel}
              </a>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className={cn(
          "text-[10px] text-muted-foreground/60 px-1",
          isRTL && "text-right"
        )}>
          {message.timestamp.toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
    </div>
  );
}
