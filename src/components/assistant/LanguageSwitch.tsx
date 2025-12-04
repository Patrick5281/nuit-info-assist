import { cn } from '@/lib/utils';
import { Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface LanguageSwitchProps {
  lang: Language;
  onToggle: () => void;
  className?: string;
}

export function LanguageSwitch({ lang, onToggle, className }: LanguageSwitchProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className={cn(
        "gap-2 font-medium transition-all hover:shadow-md",
        className
      )}
    >
      <Globe className="w-4 h-4" />
      <span className="min-w-[40px] text-center">
        {lang === 'fr' ? 'العربية' : 'Français'}
      </span>
    </Button>
  );
}
