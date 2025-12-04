import { ExternalLink, CheckCircle2, Sparkles, FileText, MapPin, Scale, Users, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIResponseData {
  answer: string;
  steps?: string[];
  links?: { title: string; url: string }[];
  category?: string;
}

interface AIResponseProps {
  data: AIResponseData;
  lang: 'fr' | 'ar';
}

const categoryIcons: Record<string, typeof FileText> = {
  documents: FileText,
  démarches: CheckCircle2,
  orientation: MapPin,
  association: Users,
  juridique: Scale,
  autre: HelpCircle,
};

const categoryLabels: Record<string, Record<string, string>> = {
  fr: {
    documents: 'Documents',
    démarches: 'Démarches',
    orientation: 'Orientation',
    association: 'Associations',
    juridique: 'Juridique',
    autre: 'Autre',
  },
  ar: {
    documents: 'الوثائق',
    démarches: 'الإجراءات',
    orientation: 'التوجيه',
    association: 'الجمعيات',
    juridique: 'القانوني',
    autre: 'أخرى',
  },
};

export function AIResponse({ data, lang }: AIResponseProps) {
  const CategoryIcon = categoryIcons[data.category || 'autre'] || HelpCircle;
  const isRTL = lang === 'ar';

  return (
    <div className={cn("space-y-4", isRTL && "text-right")}>
      {/* Category badge */}
      {data.category && (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
          "bg-primary/10 text-primary border border-primary/20"
        )}>
          <CategoryIcon className="h-3 w-3" />
          <span>{categoryLabels[lang][data.category] || data.category}</span>
        </div>
      )}

      {/* Main answer */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">
          {data.answer}
        </p>
      </div>

      {/* Steps */}
      {data.steps && data.steps.length > 0 && (
        <div className={cn(
          "rounded-xl p-4 space-y-3",
          "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
          "border border-emerald-500/20"
        )}>
          <h4 className={cn(
            "text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <CheckCircle2 className="h-4 w-4" />
            {lang === 'fr' ? 'Étapes à suivre' : 'الخطوات المطلوبة'}
          </h4>
          <ol className={cn(
            "space-y-2",
            isRTL ? "list-decimal list-inside mr-0" : "list-decimal list-inside ml-0"
          )}>
            {data.steps.map((step, index) => (
              <li 
                key={index}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                <span className="text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Links */}
      {data.links && data.links.length > 0 && (
        <div className={cn(
          "rounded-xl p-4 space-y-3",
          "bg-gradient-to-br from-blue-500/10 to-indigo-500/10",
          "border border-blue-500/20"
        )}>
          <h4 className={cn(
            "text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2",
            isRTL && "flex-row-reverse"
          )}>
            <ExternalLink className="h-4 w-4" />
            {lang === 'fr' ? 'Liens utiles' : 'روابط مفيدة'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "bg-background/50 hover:bg-background",
                  "border border-border hover:border-blue-500/50",
                  "text-foreground hover:text-blue-600 dark:hover:text-blue-400",
                  "transition-all duration-200 hover:shadow-md",
                  "group"
                )}
              >
                <span>{link.title}</span>
                <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* AI indicator */}
      <div className={cn(
        "flex items-center gap-1.5 text-xs text-muted-foreground/60",
        isRTL && "flex-row-reverse justify-end"
      )}>
        <Sparkles className="h-3 w-3" />
        <span>{lang === 'fr' ? 'Réponse générée par IA' : 'تم إنشاء الرد بواسطة الذكاء الاصطناعي'}</span>
      </div>
    </div>
  );
}
