// Internationalization for FR/AR bilingual support

export type Language = 'fr' | 'ar';

export interface Translations {
  title: string;
  subtitle: string;
  placeholder: string;
  send: string;
  thinking: string;
  searching: string;
  writing: string;
  sourceLabel: string;
  confidenceLabel: string;
  stepsLabel: string;
  linkLabel: string;
  cacheHit: string;
  ruleMatch: string;
  faqMatch: string;
  noResult: string;
  offline: string;
  online: string;
  questionsAnswered: string;
  badgeUnlocked: string;
  tutorialBadge: string;
  welcomeMessage: string;
  suggestedQuestions: string;
  category: {
    documents: string;
    'etat-civil': string;
    transport: string;
    fiscal: string;
    emploi: string;
    association: string;
    immigration: string;
    justice: string;
    social: string;
    sante: string;
    education: string;
    citoyennete: string;
    demarches: string;
  };
}

export const translations: Record<Language, Translations> = {
  fr: {
    title: 'Assistant Services Publics',
    subtitle: 'Votre guide pour les démarches administratives',
    placeholder: 'Posez votre question sur les services publics...',
    send: 'Envoyer',
    thinking: 'Je réfléchis...',
    searching: 'Je recherche dans la base...',
    writing: 'Je rédige la réponse...',
    sourceLabel: 'Source',
    confidenceLabel: 'Confiance',
    stepsLabel: 'Étapes à suivre',
    linkLabel: 'Lien officiel',
    cacheHit: 'Réponse depuis le cache (mode hors-ligne disponible)',
    ruleMatch: 'Réponse générée par règles intelligentes',
    faqMatch: 'Réponse trouvée dans la FAQ',
    noResult: "Désolé, je n'ai pas trouvé de réponse précise. Essayez de reformuler votre question ou consultez service-public.fr pour plus d'informations.",
    offline: 'Hors-ligne',
    online: 'En ligne',
    questionsAnswered: 'Questions répondues',
    badgeUnlocked: 'Badge débloqué !',
    tutorialBadge: 'Expert démarches',
    welcomeMessage: 'Bonjour ! Je suis votre assistant pour les services publics. Comment puis-je vous aider ?',
    suggestedQuestions: 'Questions suggérées',
    category: {
      documents: 'Documents',
      'etat-civil': 'État civil',
      transport: 'Transport',
      fiscal: 'Fiscal',
      emploi: 'Emploi',
      association: 'Association',
      immigration: 'Immigration',
      justice: 'Justice',
      social: 'Social',
      sante: 'Santé',
      education: 'Éducation',
      citoyennete: 'Citoyenneté',
      demarches: 'Démarches'
    }
  },
  ar: {
    title: 'مساعد الخدمات العامة',
    subtitle: 'دليلك للإجراءات الإدارية',
    placeholder: 'اطرح سؤالك حول الخدمات العامة...',
    send: 'إرسال',
    thinking: 'أفكر...',
    searching: 'أبحث في القاعدة...',
    writing: 'أكتب الإجابة...',
    sourceLabel: 'المصدر',
    confidenceLabel: 'الثقة',
    stepsLabel: 'الخطوات',
    linkLabel: 'الرابط الرسمي',
    cacheHit: 'إجابة من الذاكرة المؤقتة (متاح دون اتصال)',
    ruleMatch: 'إجابة من القواعد الذكية',
    faqMatch: 'إجابة من الأسئلة الشائعة',
    noResult: 'عذراً، لم أجد إجابة دقيقة. حاول إعادة صياغة سؤالك أو زر service-public.fr للمزيد.',
    offline: 'غير متصل',
    online: 'متصل',
    questionsAnswered: 'أسئلة مجابة',
    badgeUnlocked: 'شارة جديدة!',
    tutorialBadge: 'خبير الإجراءات',
    welcomeMessage: 'مرحباً! أنا مساعدك للخدمات العامة. كيف يمكنني مساعدتك؟',
    suggestedQuestions: 'أسئلة مقترحة',
    category: {
      documents: 'الوثائق',
      'etat-civil': 'الحالة المدنية',
      transport: 'النقل',
      fiscal: 'الضرائب',
      emploi: 'التوظيف',
      association: 'الجمعيات',
      immigration: 'الهجرة',
      justice: 'العدالة',
      social: 'الشؤون الاجتماعية',
      sante: 'الصحة',
      education: 'التعليم',
      citoyennete: 'المواطنة',
      demarches: 'الإجراءات'
    }
  }
};

export const suggestedQuestions: Record<Language, string[]> = {
  fr: [
    'Comment obtenir un passeport ?',
    'Comment renouveler sa carte d\'identité ?',
    'Comment demander une aide au logement ?',
    'Comment créer une association ?'
  ],
  ar: [
    'كيف أحصل على جواز سفر؟',
    'كيف أجدد بطاقة الهوية؟',
    'كيف أطلب المساعدة السكنية؟',
    'كيف أنشئ جمعية؟'
  ]
};
