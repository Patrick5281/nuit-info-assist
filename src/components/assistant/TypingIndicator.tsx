import { cn } from '@/lib/utils';
import { Brain, Search, PenLine } from 'lucide-react';
import { Language, translations } from '@/lib/i18n';

export type AIState = 'thinking' | 'searching' | 'writing' | 'idle';

interface TypingIndicatorProps {
  state: AIState;
  lang: Language;
  className?: string;
}

export function TypingIndicator({ state, lang, className }: TypingIndicatorProps) {
  const t = translations[lang];
  
  if (state === 'idle') return null;

  const stateConfig = {
    thinking: {
      icon: Brain,
      text: t.thinking,
      animation: 'animate-thinking'
    },
    searching: {
      icon: Search,
      text: t.searching,
      animation: 'animate-searching'
    },
    writing: {
      icon: PenLine,
      text: t.writing,
      animation: 'animate-writing'
    }
  };

  const config = stateConfig[state];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50",
        "animate-fade-in shadow-sm",
        className
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center",
        config.animation
      )}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">
          {config.text}
        </span>
        <div className="flex gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}
