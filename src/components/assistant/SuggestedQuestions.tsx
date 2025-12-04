import { cn } from '@/lib/utils';
import { Language, translations, suggestedQuestions } from '@/lib/i18n';
import { Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  lang: Language;
  onSelect: (question: string) => void;
  className?: string;
}

export function SuggestedQuestions({ lang, onSelect, className }: SuggestedQuestionsProps) {
  const t = translations[lang];
  const questions = suggestedQuestions[lang];
  const isRTL = lang === 'ar';

  return (
    <div className={cn(
      "space-y-3",
      isRTL && "text-right",
      className
    )}>
      <p className={cn(
        "text-xs font-medium text-muted-foreground flex items-center gap-1.5",
        isRTL && "flex-row-reverse justify-end"
      )}>
        <Sparkles className="w-3.5 h-3.5" />
        {t.suggestedQuestions}
      </p>
      <div className={cn(
        "flex flex-wrap gap-2",
        isRTL && "justify-end"
      )}>
        {questions.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelect(q)}
            className={cn(
              "text-xs px-3 py-2 rounded-full",
              "bg-accent/50 text-accent-foreground",
              "hover:bg-accent hover:shadow-sm",
              "transition-all duration-200",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
