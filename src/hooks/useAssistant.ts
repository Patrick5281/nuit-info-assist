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
import { supabase } from '@/integrations/supabase/client';

const CONFIDENCE_THRESHOLD = 0.25;

interface AIResponseData {
  answer: string;
  steps?: string[];
  links?: { title: string; url: string }[];
  category?: string;
}

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

  // Search AI via edge function
  const searchAI = async (query: string): Promise<{ data: AIResponseData; source: 'ai' } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('search-assistant', {
        body: { query, lang }
      });

      if (error) {
        console.error('AI search error:', error);
        return null;
      }

      if (data?.success && data?.data) {
        return { data: data.data, source: 'ai' };
      }

      return null;
    } catch (error) {
      console.error('AI search failed:', error);
      return null;
    }
  };

  // Local FAQ search
  const searchLocal = useCallback((query: string): SearchResult | null => {
    // Check cache first
    const cached = getFromCache(lang, query);
    if (cached) {
      return cached;
    }

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

    // Return best result even if below threshold
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

    let assistantMessage: Message;

    // Online mode: Try AI search first
    if (isOnline) {
      // Phase 1: Thinking
      setAIState('thinking');
      await simulateDelay(300, 500);

      // Phase 2: Searching web
      setAIState('searching');
      
      const aiResult = await searchAI(content);

      if (aiResult) {
        // Phase 3: Writing
        setAIState('writing');
        await simulateDelay(200, 400);

        assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: aiResult.data.answer,
          timestamp: new Date(),
          aiResponse: aiResult.data,
          source: 'ai'
        };
      } else {
        // AI failed, fallback to local
        const localResult = searchLocal(content);
        
        setAIState('writing');
        await simulateDelay(200, 400);

        assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: localResult ? localResult.item.answer : t.noResult,
          timestamp: new Date(),
          result: localResult || undefined,
          source: localResult ? 'faq' : undefined
        };
      }
    } else {
      // Offline mode: Use local search only
      setAIState('thinking');
      await simulateDelay(300, 500);

      setAIState('searching');
      await simulateDelay(400, 800);

      const localResult = searchLocal(content);

      setAIState('writing');
      await simulateDelay(200, 400);

      assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: localResult ? localResult.item.answer : t.noResult,
        timestamp: new Date(),
        result: localResult || undefined,
        source: 'offline'
      };
    }

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
  }, [isOnline, searchLocal, t.noResult, hasShownBadge, lang]);

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
