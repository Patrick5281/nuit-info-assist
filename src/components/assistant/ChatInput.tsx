import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/i18n';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  lang: Language;
  onSend: (message: string) => void;
  disabled?: boolean;
  className?: string;
}

export function ChatInput({ lang, onSend, disabled, className }: ChatInputProps) {
  const t = translations[lang];
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isRTL = lang === 'ar';

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  return (
    <div className={cn(
      "flex items-end gap-2 p-4 border-t border-border/50 bg-background",
      isRTL && "flex-row-reverse",
      className
    )}>
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-2xl px-4 py-3 pr-4",
            "bg-muted/50 border border-primary/60",
            "focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-primary/60",
            "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "text-sm placeholder:text-muted-foreground/60",
            "transition-none",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isRTL && "text-right"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-label={t.placeholder}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        size="icon"
        className={cn(
          "btn-primary rounded-full w-11 h-11 flex-shrink-0",
          "disabled:opacity-50 disabled:shadow-none"
        )}
        aria-label={t.send}
      >
        {disabled ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className={cn("w-5 h-5", isRTL && "rotate-180")} />
        )}
      </Button>
    </div>
  );
}
