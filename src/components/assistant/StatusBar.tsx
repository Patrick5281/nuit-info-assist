import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/i18n';
import { Wifi, WifiOff, Award, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface StatusBarProps {
  lang: Language;
  isOnline: boolean;
  questionsCount: number;
  showBadge: boolean;
  className?: string;
}

export function StatusBar({ 
  lang, 
  isOnline, 
  questionsCount, 
  showBadge,
  className 
}: StatusBarProps) {
  const t = translations[lang];
  const isRTL = lang === 'ar';

  return (
    <div className={cn(
      "flex items-center justify-between gap-4 px-4 py-2 bg-muted/50 border-b border-border/50",
      isRTL && "flex-row-reverse",
      className
    )}>
      {/* Connection status */}
      <div className={cn(
        "flex items-center gap-2",
        isRTL && "flex-row-reverse"
      )}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4 text-success" />
            <span className="text-xs text-success font-medium">{t.online}</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">{t.offline}</span>
          </>
        )}
      </div>

      {/* Questions counter and badge */}
      <div className={cn(
        "flex items-center gap-3",
        isRTL && "flex-row-reverse"
      )}>
        <div className={cn(
          "flex items-center gap-1.5 text-xs text-muted-foreground",
          isRTL && "flex-row-reverse"
        )}>
          <MessageCircle className="w-3.5 h-3.5" />
          <span>{questionsCount} {t.questionsAnswered}</span>
        </div>

        {showBadge && (
          <Badge 
            className="badge-success gap-1.5 text-xs"
          >
            <Award className="w-3.5 h-3.5" />
            {t.tutorialBadge}
          </Badge>
        )}
      </div>
    </div>
  );
}
