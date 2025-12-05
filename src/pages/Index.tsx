import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Language, translations } from '@/lib/i18n';
import { useAssistant } from '@/hooks/useAssistant';
import { ChatMessage } from '@/components/assistant/ChatMessage';
import { ChatInput } from '@/components/assistant/ChatInput';
import { TypingIndicator } from '@/components/assistant/TypingIndicator';
import { StatusBar } from '@/components/assistant/StatusBar';
import { LanguageSwitch } from '@/components/assistant/LanguageSwitch';
import { SuggestedQuestions } from '@/components/assistant/SuggestedQuestions';
import { BadgeNotification } from '@/components/assistant/BadgeNotification';
import { Button } from '@/components/ui/button';
import { Bot, Shield, Globe2, Code2, Heart } from 'lucide-react';

const Index = () => {
  const [lang, setLang] = useState<Language>('fr');
  const t = translations[lang];
  const isRTL = lang === 'ar';
  
  const {
    messages,
    aiState,
    questionsCount,
    isOnline,
    showBadge,
    showBadgeNotification,
    sendMessage,
    closeBadgeNotification
  } = useAssistant(lang);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiState]);

  // Update document direction
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'fr' ? 'ar' : 'fr');
  };

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-chat-bg chat-container",
      "text-sm sm:text-base",
      isRTL && "font-arabic"
    )}>
      {/* Badge notification */}
      <BadgeNotification 
        show={showBadgeNotification}
        lang={lang}
        onClose={closeBadgeNotification}
      />

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-40 glass border-b border-border/50 shadow-sm"
      )}>
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            "flex items-center justify-between px-4 py-3",
            isRTL && "flex-row-reverse"
          )}>
            {/* Logo and title */}
            <div className={cn(
              "flex items-center gap-3",
              isRTL && "flex-row-reverse"
            )}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h1 className="font-semibold text-foreground text-sm sm:text-base">
                  {t.title}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Language switch */}
            <LanguageSwitch lang={lang} onToggle={toggleLanguage} />
          </div>

          {/* Status bar */}
          <StatusBar
            lang={lang}
            isOnline={isOnline}
            questionsCount={questionsCount}
            showBadge={showBadge}
          />
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-hidden">
        <div 
          ref={chatContainerRef}
          className="h-full overflow-y-auto scrollbar-thin"
        >
          <div className="max-w-3xl mx-auto py-6 px-4">
            <div
              className="rounded-3xl border border-border/60 bg-card/90 shadow-glow-lg backdrop-blur-md px-4 sm:px-6 py-4 sm:py-6 space-y-4"
              role="log"
              aria-live="polite"
              aria-label={lang === 'fr' ? 'Historique de la conversation' : 'سجل المحادثة'}
            >
              {/* Messages */}
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  lang={lang}
                  isLatest={index === messages.length - 1}
                />
              ))}

              {/* Typing indicator */}
              {aiState !== 'idle' && (
                <div className={cn(
                  "flex",
                  isRTL ? "justify-end" : "justify-start"
                )}>
                  <TypingIndicator state={aiState} lang={lang} />
                </div>
              )}

              {/* Suggested questions (show only at start) */}
              {messages.length <= 1 && (
                <div className="pt-2">
                  <SuggestedQuestions
                    lang={lang}
                    onSelect={handleSuggestedQuestion}
                  />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            <div
              className={cn(
                "mt-4 rounded-2xl border border-border/50 bg-gradient-to-b from-background/90 to-background/70",
                "px-4 py-4 sm:px-6 sm:py-5 shadow-sm"
              )}
            >
              <p
                className={cn(
                  "text-[11px] sm:text-xs font-medium tracking-wide text-muted-foreground/80 mb-3",
                  isRTL && "text-right"
                )}
              >
                {lang === 'fr'
                  ? 'Intégré au défi national NIRD - Numérique Inclusif, Responsable et Durable'
                  : 'ضمن التحدي الوطني NIRD - رقم شامل ومسؤول ومستدام'}
              </p>
              <div
                className={cn(
                  "grid gap-4 sm:grid-cols-3 mb-4",
                  isRTL && "text-right"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10">
                    <Globe2 className="h-5 w-5 text-emerald-500" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">
                      {lang === 'fr' ? 'Inclusif' : 'شامل'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === 'fr'
                        ? 'Accessible à tous, design universel'
                        : 'متاح للجميع، تصميم شامل'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/10">
                    <Code2 className="h-5 w-5 text-amber-400" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">
                      {lang === 'fr' ? 'Responsable' : 'مسؤول'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === 'fr'
                        ? 'Open source, logiciels libres'
                        : 'برمجيات حرة ومفتوحة المصدر'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10">
                    <Heart className="h-5 w-5 text-purple-500" />
                  </span>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold">
                      {lang === 'fr' ? 'Durable' : 'مستدام'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {lang === 'fr'
                        ? 'Sobriété numérique, éco-conception'
                        : 'اعتدال رقمي وتصميم صديق للبيئة'}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
                  isRTL && "sm:flex-row-reverse sm:text-right"
                )}
              >
                <div className="space-y-1">
                  <p className="text-sm font-semibold">
                    {lang === 'fr'
                      ? 'Prêt à rejoindre la communauté ?'
                      : 'هل أنت مستعد للانضمام إلى المجتمع؟'}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {lang === 'fr'
                      ? 'Créez votre profil ou présentez votre projet aux membres du jury.'
                      : 'قدّم مشروعك أو ملفك إلى لجنة التحكيم والمجتمع.'}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="btn-primary rounded-full px-4 text-xs whitespace-nowrap"
                  asChild
                >
                  <a
                    href="https://nird.forge.apps.education.fr/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lang === 'fr'
                      ? 'Rejoindre la communauté NIRD'
                      : 'الانضمام إلى مجتمع NIRD'}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Input area */}
      <div className="sticky bottom-0 z-40 glass border-t border-border/50">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            lang={lang}
            onSend={sendMessage}
            disabled={aiState !== 'idle'}
          />
          
          {/* Footer */}
          <div className={cn(
            "flex flex-wrap items-center justify-center pb-3 px-4",
            "text-xs text-muted-foreground/80"
          )}>
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/80 border border-border/60 px-3 py-1 shadow-sm backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span className="flex flex-wrap items-center justify-center gap-1">
                <span>
                  {lang === 'fr' 
                    ? 'Assistant IA hors-ligne • Données traitées localement'
                    : 'مساعد ذكاء اصطناعي غير متصل • البيانات تُعالج محلياً'
                  }
                </span>
                <span className="mx-1 text-muted-foreground/60">•</span>
                <span className="font-semibold tracking-wide uppercase text-foreground">
                  District 25
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
