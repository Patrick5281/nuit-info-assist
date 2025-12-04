import { useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '@/lib/i18n';
import {
  FAQItem,
  TFIDFIndex,
  SearchResult,
  buildIndex,
  searchTFIDF,
  applyKeywordRules,
  getFromCache,
  saveToCache,
  incrementQuestionsCount,
  getQuestionsCount
} from '@/lib/tfidf';
import { Message } from '@/components/assistant/ChatMessage';
import { AIState } from '@/components/assistant/TypingIndicator';
import faqFr from '@/data/faq_fr.json';
import faqAr from '@/data/faq_ar.json';
import { translations } from '@/lib/i18n';

const CONFIDENCE_THRESHOLD = 0.25;

export function useAssistant(lang: Language) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiState, setAIState] = useState<AIState>('idle');
  const [questionsCount, setQuestionsCount] = useState(getQuestionsCount);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [hasShownBadge, setHasShownBadge] = useState(() => {
    return localStorage.getItem('badge_shown') === 'true';
  });
  
  const indexRef = useRef<TFIDFIndex | null>(null);
  const t = translations[lang];

  // Build index on mount and language change
  useEffect(() => {
    const faqData = lang === 'fr' ? faqFr : faqAr;
    indexRef.current = buildIndex(faqData as FAQItem[]);
  }, [lang]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Add welcome message on mount
  useEffect(() => {
    const welcomeMsg: Message = {
      id: 'welcome',
      role: 'assistant',
      content: t.welcomeMessage,
      timestamp: new Date()
    };
    setMessages([welcomeMsg]);
  }, [lang]);

  const simulateDelay = (min: number, max: number) => {
    return new Promise(resolve => 
      setTimeout(resolve, min + Math.random() * (max - min))
    );
  };

  const search = useCallback(async (query: string): Promise<SearchResult | null> => {
    // Phase 1: Thinking
    setAIState('thinking');
    await simulateDelay(400, 800);

    // Check cache first
    const cached = getFromCache(lang, query);
    if (cached) {
      return cached;
    }

    // Phase 2: Searching
    setAIState('searching');
    await simulateDelay(600, 1200);

    if (!indexRef.current) return null;

    // TF-IDF search
    const results = searchTFIDF(query, indexRef.current, 5);
    
    if (results.length > 0 && results[0].score >= CONFIDENCE_THRESHOLD) {
      saveToCache(lang, query, results[0]);
      return results[0];
    }

    // Fallback to keyword rules
    const ruleResult = applyKeywordRules(query, lang);
    if (ruleResult) {
      saveToCache(lang, query, ruleResult);
      return ruleResult;
    }

    // Return best result even if below threshold, or null
    if (results.length > 0) {
      return results[0];
    }

    return null;
  }, [lang]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Search for response
    const result = await search(content);

    // Phase 3: Writing
    setAIState('writing');
    await simulateDelay(300, 600);

    // Create assistant response
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: result ? result.item.answer : t.noResult,
      timestamp: new Date(),
      result: result || undefined
    };

    setMessages(prev => [...prev, assistantMessage]);
    setAIState('idle');

    // Update questions count
    const newCount = incrementQuestionsCount();
    setQuestionsCount(newCount);

    // Check for badge unlock
    if (newCount >= 3 && !hasShownBadge) {
      setShowBadgeNotification(true);
      setHasShownBadge(true);
      localStorage.setItem('badge_shown', 'true');
    }
  }, [search, t.noResult, hasShownBadge]);

  const closeBadgeNotification = useCallback(() => {
    setShowBadgeNotification(false);
  }, []);

  return {
    messages,
    aiState,
    questionsCount,
    isOnline,
    showBadge: questionsCount >= 3,
    showBadgeNotification,
    sendMessage,
    closeBadgeNotification
  };
}
