import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, lang } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing query: "${query}" in language: ${lang}`);

    const systemPrompt = lang === 'ar' 
      ? `أنت مساعد إداري ذكي متخصص في مساعدة المستخدمين للوصول إلى الخدمات العامة الرقمية.
      
مهمتك:
1. فهم احتياجات المستخدم الإدارية
2. تقديم معلومات دقيقة ومفيدة عن الإجراءات والوثائق المطلوبة
3. توجيه المستخدم نحو الخدمات المناسبة

قواعد الإجابة:
- قدم إجابة منظمة وواضحة
- اذكر الخطوات المطلوبة إن وجدت
- اقترح روابط حقيقية للخدمات الحكومية الفرنسية (service-public.fr, ameli.fr, impots.gouv.fr, إلخ)
- كن ودودًا ومحترفًا

أجب باللغة العربية فقط.`
      : `Tu es un assistant administratif intelligent spécialisé dans l'aide aux citoyens pour accéder aux services publics numériques.

Ta mission:
1. Comprendre les besoins administratifs de l'utilisateur
2. Fournir des informations précises et utiles sur les démarches et documents requis
3. Orienter vers les services appropriés

Règles de réponse:
- Fournis une réponse structurée et claire
- Mentionne les étapes nécessaires si applicable
- Suggère des liens réels vers les services gouvernementaux français (service-public.fr, ameli.fr, impots.gouv.fr, caf.fr, etc.)
- Sois amical et professionnel

Format ta réponse en JSON avec cette structure:
{
  "answer": "La réponse principale détaillée",
  "steps": ["Étape 1", "Étape 2", ...] (optionnel, si des étapes sont nécessaires),
  "links": [{"title": "Nom du service", "url": "https://..."}] (liens utiles),
  "category": "documents|démarches|orientation|association|juridique|autre"
}

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Rate limit exceeded");
        return new Response(JSON.stringify({ error: "rate_limit", message: "Trop de requêtes, réessayez plus tard." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error("Payment required");
        return new Response(JSON.stringify({ error: "payment_required", message: "Crédits insuffisants." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response:", content);

    // Try to parse as JSON, fallback to raw text
    let parsedResponse;
    try {
      // Clean potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanContent);
    } catch {
      // If not valid JSON, create structured response from text
      parsedResponse = {
        answer: content,
        steps: [],
        links: [],
        category: "autre"
      };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: parsedResponse,
      source: "ai"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Search assistant error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
