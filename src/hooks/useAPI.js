const MODEL = 'claude-sonnet-4-20250514';
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const BACKEND_URL = process.env.REACT_APP_TELEGRAM_SERVER_URL || 'http://localhost:5000';

const makeHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return headers;
};

export const isGeminiEnabled = Boolean(GEMINI_KEY);
export const isOpenAIEnabled = Boolean(OPENAI_KEY);

// Gemini: Rasm tahlili (Vision API)
export async function analyzeTestImageWithGemini(base64, mediaType) {
  try {
    if (!GEMINI_KEY) return null;

    const prompt = `Bu test varaqasi rasmini tahlil qil. Faqat sof JSON qaytar (markdown yoki backtick ishlatma):
{"subject":"Fan nomi","totalQuestions":10,"wrongAnswers":[{"questionNumber":3,"topic":"Mavzu","studentAnswer":"B","correctAnswer":"A","explanation":"Izoh"}],"score":70,"summary":"Umumiy xulosa"}
Agar rasm aniq korinmasa ham shunga oxshash toliq namuna qaytar.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inline_data: { mime_type: mediaType, data: base64 } },
              { text: prompt },
            ],
          }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 1500 },
        }),
      }
    );

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        const p = JSON.parse(m[0]);
        if (p.subject && p.score !== undefined) return { ...p, _aiProvider: 'gemini' };
      } catch {}
    }
    return null;
  } catch { return null; }
}

// Test rasmini tahlil qilish (asosiy funksiya)
// Ustuvorlik: OpenAI -> Gemini -> Claude
export async function analyzeTestImage(base64, mediaType) {
  try {
    if (OPENAI_KEY) {
      const res = await fetch(`${BACKEND_URL}/api/openai-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mediaType }),
      });
      const data = await res.json();
      if (!res.ok || !data.response) return demoResult();
      const m = (data.response || '').match(/\{[\s\S]*\}/);
      if (m) {
        try {
          const p = JSON.parse(m[0]);
          if (p.subject && p.score !== undefined) return p;
        } catch {}
      }
      return demoResult();
    }

    // Gemini AI Vision
    if (GEMINI_KEY) {
      const geminiResult = await analyzeTestImageWithGemini(base64, mediaType);
      if (geminiResult) return geminiResult;
    }

    // Claude fallback
    if (!API_KEY) return demoResult();
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify({
        model: MODEL, max_tokens: 1500,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          { type: 'text', text: `Bu test varaqasi. Faqat JSON qaytar:\n{"subject":"Fan","totalQuestions":10,"wrongAnswers":[{"questionNumber":3,"topic":"Mavzu","studentAnswer":"B","correctAnswer":"A","explanation":"Izoh"}],"score":70,"summary":"Xulosa"}\nAgar aniq korinmasa ham namuna qaytar.` },
        ]}],
      }),
    });
    const data = await res.json();
    if (data.error) return demoResult();
    const m = (data.content?.[0]?.text || '').match(/\{[\s\S]*\}/);
    if (m) { try { const p = JSON.parse(m[0]); if (p.subject && p.score !== undefined) return p; } catch {} }
    return demoResult();
  } catch { return demoResult(); }
}

// Claude: Matn chatbot
export async function callClaude(messages, system) {
  try {
    if (!API_KEY) return "AI kalit yo'q.";
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify({
        model: MODEL, max_tokens: 900, system,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || 'Xatolik.';
  } catch { return 'Tarmoq xatosi.'; }
}

// Gemini: Matn chatbot (Gemini 2.0 Flash API)
export async function callGemini(messages, system) {
  try {
    if (!GEMINI_KEY) return "Gemini AI kalit yo'q.";

    const contents = [];

    // Birinchi xabar: system prefix bilan
    if (messages.length > 0) {
      const systemPrefix = system ? `${system}\n\n` : '';
      contents.push({ role: 'user', parts: [{ text: systemPrefix + messages[0].content }] });
    }

    // Qolgan xabarlar
    for (let i = 1; i < messages.length; i++) {
      const msg = messages[i];
      const role = msg.role === 'assistant' ? 'model' : 'user';
      contents.push({ role, parts: [{ text: msg.content }] });
    }

    const body = { contents, generationConfig: { temperature: 0.3, maxOutputTokens: 900 } };
    if (system) body.systemInstruction = { parts: [{ text: system }] };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Xatolik.';
  } catch { return 'Tarmoq xatosi.'; }
}

// OpenAI: Matn chatbot
export async function callOpenAI(messages, system, model = 'gpt-3.5-turbo', maxTokens = 500) {
  try {
    if (!OPENAI_KEY) return "OpenAI kalit yo'q.";
    const openaiMessages = system ? [{ role: 'system', content: system }, ...messages] : messages;
    const res = await fetch(`${BACKEND_URL}/api/openai`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: openaiMessages, model, maxTokens }),
    });
    const data = await res.json();
    return data.response || 'Xatolik.';
  } catch { return 'Tarmoq xatosi.'; }
}

// Umumiy AI chaqiruvi: OpenAI -> Gemini -> Claude
export async function callAI(messages, system) {
  if (isOpenAIEnabled) return callOpenAI(messages, system);
  if (isGeminiEnabled) return callGemini(messages, system);
  return callClaude(messages, system);
}

// Telegram
export async function sendTelegramMessage(chatId, text) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/telegram/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, text }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Telegramga yuborishda xato.');
    return data;
  } catch (error) {
    return { error: error.message || 'Telegram xatosi.' };
  }
}

export function parseAI(text) {
  try {
    const m = text.trim().match(/\{[\s\S]*?\}/);
    if (m) { const j = JSON.parse(m[0]); if (j.text) return { content: j.text, quiz: j.quiz || null }; }
  } catch {}
  return { content: text, quiz: null };
}

export function demoResult() {
  return {
    subject: 'Matematika', totalQuestions: 20, score: 65,
    wrongAnswers: [
      { questionNumber: 3,  topic: 'Kvadrat tenglamalar', studentAnswer: 'B', correctAnswer: 'A', explanation: "D=b2-4ac formulasida xato." },
      { questionNumber: 7,  topic: 'Logarifm',            studentAnswer: 'C', correctAnswer: 'D', explanation: "log(a*b)=log(a)+log(b) qoidasi unutilgan." },
      { questionNumber: 9,  topic: 'Trigonometriya',      studentAnswer: 'A', correctAnswer: 'C', explanation: "sin2x+cos2x=1 identligi unutilgan." },
      { questionNumber: 14, topic: 'Funksiya grafigi',    studentAnswer: 'D', correctAnswer: 'B', explanation: "Parabola ildizlari x o'qi bilan kesishadi." },
      { questionNumber: 18, topic: 'Progressiya',         studentAnswer: 'A', correctAnswer: 'C', explanation: "an=a1+(n-1)d formulasida xato." },
    ],
    summary: "13 ta togri, 7 ta xato. Logarifm va trigonometriyani mustahkamlash kerak.",
  };
}
