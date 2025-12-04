// TF-IDF Engine for Low-Cost AI Assistant
// Client-side search implementation supporting French and Arabic

export interface FAQItem {
  id: string;
  title: string;
  question: string;
  keywords: string[];
  answer: string;
  steps?: string[];
  link?: string;
  category: string;
  lang: string;
}

export interface SearchResult {
  item: FAQItem;
  score: number;
  source: 'faq' | 'rule' | 'cache';
}

export interface TFIDFIndex {
  documents: FAQItem[];
  idf: Map<string, number>;
  docVectors: Map<string, Map<string, number>>;
}

// Normalize text for both French and Arabic
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for French
    .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ') // Keep Latin, Arabic, and whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Tokenize text into words
export function tokenize(text: string): string[] {
  const normalized = normalize(text);
  return normalized.split(' ').filter(token => token.length > 1);
}

// Calculate term frequency
function termFrequency(term: string, tokens: string[]): number {
  const count = tokens.filter(t => t === term).length;
  return count / tokens.length;
}

// Build TF-IDF index from documents
export function buildIndex(docs: FAQItem[]): TFIDFIndex {
  const idf = new Map<string, number>();
  const docVectors = new Map<string, Map<string, number>>();
  const N = docs.length;

  // Collect all terms and document frequencies
  const termDocCount = new Map<string, number>();
  const docTokens = new Map<string, string[]>();

  docs.forEach(doc => {
    const text = `${doc.title} ${doc.question} ${doc.keywords.join(' ')} ${doc.answer}`;
    const tokens = tokenize(text);
    docTokens.set(doc.id, tokens);

    const uniqueTerms = new Set(tokens);
    uniqueTerms.forEach(term => {
      termDocCount.set(term, (termDocCount.get(term) || 0) + 1);
    });
  });

  // Calculate IDF for each term
  termDocCount.forEach((count, term) => {
    idf.set(term, Math.log(N / count) + 1);
  });

  // Build TF-IDF vectors for each document
  docs.forEach(doc => {
    const tokens = docTokens.get(doc.id)!;
    const vector = new Map<string, number>();

    const uniqueTerms = new Set(tokens);
    uniqueTerms.forEach(term => {
      const tf = termFrequency(term, tokens);
      const idfValue = idf.get(term) || 0;
      vector.set(term, tf * idfValue);
    });

    docVectors.set(doc.id, vector);
  });

  return { documents: docs, idf, docVectors };
}

// Convert query to TF-IDF vector
export function queryToVector(query: string, index: TFIDFIndex): Map<string, number> {
  const tokens = tokenize(query);
  const vector = new Map<string, number>();

  const uniqueTerms = new Set(tokens);
  uniqueTerms.forEach(term => {
    const tf = termFrequency(term, tokens);
    const idfValue = index.idf.get(term) || 0;
    vector.set(term, tf * idfValue);
  });

  return vector;
}

// Calculate cosine similarity between two vectors
export function cosineSimilarity(
  vec1: Map<string, number>,
  vec2: Map<string, number>
): number {
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  vec1.forEach((value, key) => {
    norm1 += value * value;
    if (vec2.has(key)) {
      dotProduct += value * vec2.get(key)!;
    }
  });

  vec2.forEach(value => {
    norm2 += value * value;
  });

  const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
  return magnitude > 0 ? dotProduct / magnitude : 0;
}

// Search documents using TF-IDF
export function searchTFIDF(
  query: string,
  index: TFIDFIndex,
  topK: number = 5
): SearchResult[] {
  const queryVec = queryToVector(query, index);
  const results: SearchResult[] = [];

  index.documents.forEach(doc => {
    const docVec = index.docVectors.get(doc.id);
    if (docVec) {
      const score = cosineSimilarity(queryVec, docVec);
      if (score > 0) {
        results.push({ item: doc, score, source: 'faq' });
      }
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}

// Keyword rules fallback
const KEYWORD_RULES: Record<string, Record<string, { response: string; category: string }>> = {
  fr: {
    passeport: {
      response: "Pour les questions relatives au passeport, rendez-vous sur service-public.fr ou contactez votre mairie.",
      category: "documents"
    },
    naissance: {
      response: "Les actes de naissance sont délivrés par la mairie du lieu de naissance ou en ligne sur service-public.fr.",
      category: "etat-civil"
    },
    identité: {
      response: "Pour la carte d'identité, prenez rendez-vous en mairie avec les documents nécessaires.",
      category: "documents"
    },
    association: {
      response: "Pour créer une association, rédigez les statuts et déclarez-la en préfecture ou sur le-compte-asso.associations.gouv.fr.",
      category: "association"
    },
    casier: {
      response: "L'extrait de casier judiciaire (bulletin n°3) est gratuit sur casier-judiciaire.justice.gouv.fr.",
      category: "justice"
    },
    visa: {
      response: "Les demandes de visa se font auprès du consulat français de votre pays sur france-visas.gouv.fr.",
      category: "immigration"
    },
    aide: {
      response: "Pour les aides sociales (RSA, APL, Prime d'activité), consultez caf.fr ou msa.fr selon votre régime.",
      category: "social"
    },
    "carte grise": {
      response: "La carte grise se demande uniquement en ligne sur immatriculation.ants.gouv.fr.",
      category: "transport"
    },
    mariage: {
      response: "Le mariage civil se prépare en mairie. Retirez le dossier et fixez une date avec l'officier d'état civil.",
      category: "etat-civil"
    },
    impôts: {
      response: "La déclaration d'impôts se fait sur impots.gouv.fr entre avril et juin chaque année.",
      category: "fiscal"
    }
  },
  ar: {
    جواز: {
      response: "لأسئلة جواز السفر، توجه إلى service-public.fr أو اتصل ببلديتك.",
      category: "documents"
    },
    ميلاد: {
      response: "شهادات الميلاد تُسلّم من بلدية مكان الولادة أو عبر الإنترنت.",
      category: "etat-civil"
    },
    هوية: {
      response: "لبطاقة الهوية، احجز موعداً في البلدية مع الوثائق اللازمة.",
      category: "documents"
    },
    جمعية: {
      response: "لإنشاء جمعية، حرر النظام الأساسي وصرّح بها في المحافظة.",
      category: "association"
    },
    عدلي: {
      response: "مستخرج السجل العدلي مجاني على casier-judiciaire.justice.gouv.fr.",
      category: "justice"
    },
    تأشيرة: {
      response: "طلبات التأشيرة تتم في القنصلية الفرنسية على france-visas.gouv.fr.",
      category: "immigration"
    },
    مساعدة: {
      response: "للمساعدات الاجتماعية (RSA، APL)، راجع caf.fr.",
      category: "social"
    },
    زواج: {
      response: "الزواج المدني يُعد في البلدية. اسحب الملف وحدد موعداً.",
      category: "etat-civil"
    },
    ضرائب: {
      response: "التصريح الضريبي يتم على impots.gouv.fr بين أبريل ويونيو.",
      category: "fiscal"
    }
  }
};

// Apply keyword rules fallback
export function applyKeywordRules(
  query: string,
  lang: 'fr' | 'ar'
): SearchResult | null {
  const normalizedQuery = normalize(query);
  const rules = KEYWORD_RULES[lang];

  for (const [keyword, rule] of Object.entries(rules)) {
    if (normalizedQuery.includes(normalize(keyword))) {
      return {
        item: {
          id: `rule-${keyword}`,
          title: lang === 'fr' ? 'Réponse automatique' : 'رد تلقائي',
          question: query,
          keywords: [keyword],
          answer: rule.response,
          category: rule.category,
          lang
        },
        score: 0.4,
        source: 'rule'
      };
    }
  }

  return null;
}

// Cache management
const CACHE_PREFIX = 'assistant_cache::';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

export function getCacheKey(lang: string, query: string): string {
  const normalized = normalize(query);
  // Simple hash for cache key
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `${CACHE_PREFIX}${lang}::${Math.abs(hash).toString(36)}`;
}

export function getFromCache(lang: string, query: string): SearchResult | null {
  try {
    const key = getCacheKey(lang, query);
    const cached = localStorage.getItem(key);
    if (cached) {
      const data = JSON.parse(cached);
      if (Date.now() - data.ts < CACHE_TTL) {
        return { ...data.result, source: 'cache' as const };
      }
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }
  return null;
}

export function saveToCache(lang: string, query: string, result: SearchResult): void {
  try {
    const key = getCacheKey(lang, query);
    localStorage.setItem(key, JSON.stringify({
      ts: Date.now(),
      query,
      result
    }));
  } catch (e) {
    console.warn('Cache write error:', e);
  }
}

// Gamification: track questions answered
const QUESTIONS_KEY = 'assistant_questions_count';

export function incrementQuestionsCount(): number {
  try {
    const count = parseInt(localStorage.getItem(QUESTIONS_KEY) || '0', 10) + 1;
    localStorage.setItem(QUESTIONS_KEY, count.toString());
    return count;
  } catch {
    return 1;
  }
}

export function getQuestionsCount(): number {
  try {
    return parseInt(localStorage.getItem(QUESTIONS_KEY) || '0', 10);
  } catch {
    return 0;
  }
}
