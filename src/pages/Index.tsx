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
import { Bot, Shield } from 'lucide-react';

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
      "min-h-screen flex flex-col bg-chat-bg",
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
        "sticky top-0 z-40 glass border-b border-border/50"
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
          <div className="max-w-3xl mx-auto py-4 px-4 space-y-4">
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
              <div className="pt-4">
                <SuggestedQuestions
                  lang={lang}
                  onSelect={handleSuggestedQuestion}
                />
              </div>
            )}

            <div ref={messagesEndRef} />
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
            "flex items-center justify-center gap-2 pb-3 px-4",
            "text-[10px] text-muted-foreground/60"
          )}>
            <Shield className="w-3 h-3" />
            <span>
              {lang === 'fr' 
                ? 'Assistant IA hors-ligne • Données traitées localement'
                : 'مساعد ذكاء اصطناعي غير متصل • البيانات تُعالج محلياً'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
