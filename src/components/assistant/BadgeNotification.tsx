import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/i18n';
import { Award, X } from 'lucide-react';

interface BadgeNotificationProps {
  show: boolean;
  lang: Language;
  onClose: () => void;
}

export function BadgeNotification({ show, lang, onClose }: BadgeNotificationProps) {
  const t = translations[lang];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50",
      "animate-bounce-in"
    )}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-2xl",
        "bg-success text-success-foreground shadow-lg",
        "border border-success/20"
      )}>
        <div className="w-10 h-10 rounded-full bg-success-foreground/20 flex items-center justify-center animate-pulse-soft">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <p className="font-semibold text-sm">{t.badgeUnlocked}</p>
          <p className="text-xs opacity-90">{t.tutorialBadge}</p>
        </div>
        <button 
          onClick={() => { setVisible(false); onClose(); }}
          className="p-1 hover:bg-success-foreground/10 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
