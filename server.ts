import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Gemini client initialization warning:', err);
  }
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    geminiAvailable: Boolean(aiClient),
    timestamp: new Date().toISOString()
  });
});

// Explain scheme in simple plain language or Indian languages
app.post('/api/gemini/explain', async (req, res) => {
  const { schemeName, benefits, eligibility, language = 'en' } = req.body;

  const targetLang = language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English';

  const prompt = `You are Yojana Sarthi, an empathetic citizen advisor for Indian government schemes.
Explain the following government scheme in extremely simple, practical language for a citizen (such as a farmer, artisan, student, or daily-wage worker).
CRITICAL RULES:
1. Do NOT invent eligibility rules or benefits. Rely solely on the provided verified scheme info.
2. Never claim the citizen is guaranteed to receive it.
3. Language to reply in: ${targetLang}. Keep words conversational and clear (avoid heavy legal/bureaucratic jargon).
4. Provide:
   - What it gives you (1-2 sentences)
   - Who should consider applying (2 bullet points)
   - Immediate next practical step (1 sentence)

Scheme Name: ${schemeName}
Benefits: ${benefits}
Eligibility criteria: ${eligibility}`;

  function getFallbackExplanation() {
    let fallbackText = `What it gives you: This scheme provides verified support under ${schemeName}, offering ${benefits}.\n\nWho should apply:\n• Citizens matching the verified criteria: ${eligibility}.\n• Those with required documentation ready.\n\nNext step: Review your documents and proceed to the official government portal to apply.`;
    if (language === 'hi') {
      fallbackText = `यह क्या प्रदान करता है: यह योजना ${schemeName} के तहत सत्यापित सहायता (${benefits}) प्रदान करती है।\n\nकिन्हें आवेदन करना चाहिए:\n• वे नागरिक जो मानदंडों (${eligibility}) को पूरा करते हैं।\n• जिनके पास संबंधित दस्तावेज तैयार हैं।\n\nअगला कदम: अपने दस्तावेजों की जांच करें और आधिकारिक सरकारी पोर्टल पर आवेदन करें।`;
    } else if (language === 'kn') {
      fallbackText = `ಇದು ಏನು ನೀಡುತ್ತದೆ: ಈ ಯೋಜನೆಯು ${schemeName} ಅಡಿಯಲ್ಲಿ ${benefits} ಸೌಲಭ್ಯವನ್ನು ಒದಗಿಸುತ್ತದೆ.\n\nಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು:\n• ನಿಗದಿತ ಮಾನದಂಡಗಳನ್ನು (${eligibility}) ಪೂರೈಸುವ ನಾಗರಿಕರು.\n• ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಹೊಂದಿರುವವರು.\n\nಮುಂದಿನ ಹಂತ: ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.`;
    }
    return fallbackText;
  }

  if (!aiClient) {
    return res.json({ explanation: getFallbackExplanation(), source: 'rule-engine-verified' });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return res.json({
      explanation: response.text || getFallbackExplanation(),
      source: 'gemini-grounded-verified'
    });
  } catch (err: any) {
    console.warn('Gemini high demand or error, providing verified fallback:', err?.message || err);
    return res.json({
      explanation: getFallbackExplanation(),
      source: 'rule-engine-verified-fallback'
    });
  }
});

// Voice / free-text query parsing into profile parameters
app.post('/api/gemini/voice-parse', async (req, res) => {
  const { query, language = 'en' } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }

  const prompt = `Analyze this citizen query in India seeking government welfare help: "${query}".
Extract best-matching profile filters without inventing.
Return strictly valid JSON with these keys:
{
  "occupation": "farmer" | "worker" | "street_vendor" | "artisan" | "student" | "business" | "other",
  "state": string (e.g. "Karnataka", "Uttar Pradesh", "All") or null,
  "needs": string[] (subset of ["agriculture", "loan", "financial", "skill", "employment", "scholarship", "housing", "healthcare", "business", "tools", "insurance"]),
  "summary": string (1 line summary in English of what they are looking for)
}
Only output the JSON object, nothing else.`;

  function getKeywordFallback() {
    const qLower = query.toLowerCase();
    let occupation = 'other';
    let needs: string[] = [];
    let state = 'All';

    if (qLower.includes('farmer') || qLower.includes('kisan') || qLower.includes('crop') || qLower.includes('paddy') || qLower.includes('raitha')) {
      occupation = 'farmer';
      needs.push('agriculture', 'financial');
    } else if (qLower.includes('vendor') || qLower.includes('cart') || qLower.includes('street') || qLower.includes('thela')) {
      occupation = 'street_vendor';
      needs.push('loan', 'financial');
    } else if (qLower.includes('student') || qLower.includes('college') || qLower.includes('school') || qLower.includes('scholarship') || qLower.includes('study')) {
      occupation = 'student';
      needs.push('scholarship', 'skill');
    } else if (qLower.includes('artisan') || qLower.includes('craft') || qLower.includes('weaver') || qLower.includes('carpenter') || qLower.includes('vishwakarma')) {
      occupation = 'artisan';
      needs.push('tools', 'loan', 'skill');
    } else if (qLower.includes('business') || qLower.includes('shop') || qLower.includes('msme') || qLower.includes('udyam')) {
      occupation = 'business';
      needs.push('business', 'loan');
    } else if (qLower.includes('worker') || qLower.includes('labor') || qLower.includes('shramik') || qLower.includes('apprentice')) {
      occupation = 'worker';
      needs.push('employment', 'skill');
    }

    if (qLower.includes('karnataka') || qLower.includes('bangalore') || qLower.includes('belagavi') || qLower.includes('mysore')) {
      state = 'Karnataka';
    }

    return {
      occupation,
      state,
      needs: needs.length ? needs : ['financial'],
      summary: `Query matching ${occupation} support.`
    };
  }

  if (!aiClient) {
    return res.json({
      parsed: getKeywordFallback(),
      source: 'rule-parser-fallback'
    });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    const text = response.text?.trim() || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : getKeywordFallback();
    return res.json({ parsed, source: 'gemini-parsed' });
  } catch (err: any) {
    console.warn('Gemini error in voice-parse, providing keyword fallback:', err?.message || err);
    return res.json({ parsed: getKeywordFallback(), source: 'rule-parser-fallback' });
  }
});

// Admin change detection & notification summarizer
app.post('/api/gemini/summarize-update', async (req, res) => {
  const { schemeName, rawUpdateText } = req.body;

  const prompt = `You are assisting Yojana Sarthi administrators.
Summarize the following official government update for "${schemeName}".
Provide a concise, verified public notification summary:
1. Short Title (max 8 words)
2. Summary (2-3 simple sentences in plain language)
3. Action required by citizens (if any)

Raw official update text:
${rawUpdateText}`;

  if (!aiClient) {
    return res.json({
      title: `${schemeName} Guidelines Update`,
      summary: `The ministry has released updated operational guidelines for ${schemeName}. Verification is in progress.`,
      actionRequired: 'Check the official portal to ensure your submitted details are up to date.',
      source: 'default-summary'
    });
  }

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });
    return res.json({ summaryText: response.text, source: 'gemini-summarized' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to summarize update', message: err.message });
  }
});

// Setup dev server with Vite middleware or serve production dist
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Yojana Sarthi server running on http://localhost:${PORT}`);
  });
}

startServer();
