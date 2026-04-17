require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const OpenAI = require('openai');
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DATA_FILE = path.join(__dirname, 'data.json');

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const loadData = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { users: [], sessions: {}, nextUserId: 1 };
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    console.error('Data load error:', error);
    return { users: [], sessions: {}, nextUserId: 1 };
  }
};

const saveData = data => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
};

const hashPassword = password => crypto.createHash('sha256').update(password).digest('hex');
const createToken = () => crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');

const data = loadData();

const findUserByEmail = email => data.users.find(user => user.email.toLowerCase() === email.toLowerCase());
const findUserById = id => data.users.find(user => user.id === id);
const getUserFromToken = token => {
  const userId = data.sessions[token];
  if (!userId) return null;
  return findUserById(userId);
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization token kerak.' });
  const user = getUserFromToken(token);
  if (!user) return res.status(401).json({ error: 'Token aniqlanmadi yoki muddati tugagan.' });
  req.user = user;
  req.token = token;
  next();
};

const createPublicUser = user => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
});

const ensureDemoUser = () => {
  if (!findUserByEmail('demo@ait.uz')) {
    const demoUser = {
      id: data.nextUserId++,
      name: 'Demo foydalanuvchi',
      email: 'demo@ait.uz',
      phone: '+998901234567',
      passwordHash: hashPassword('demo123'),
      settings: { lang: 'uz', notif: true, sound: true },
      history: [],
    };
    data.users.push(demoUser);
    saveData(data);
  }
};
ensureDemoUser();

const createAuthResponse = user => {
  const token = createToken();
  data.sessions[token] = user.id;
  saveData(data);
  return {
    token,
    user: createPublicUser(user),
    settings: user.settings,
  };
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', telegram: Boolean(TELEGRAM_BOT_TOKEN), users: data.users.length });
});

app.post('/api/telegram/send', async (req, res) => {
  if (!TELEGRAM_BOT_TOKEN) {
    return res.status(500).json({ error: 'TELEGRAM_BOT_TOKEN yoʻq. .env fayliga qoʻshing.' });
  }

  const { chatId, text, parseMode = 'HTML' } = req.body;
  if (!chatId || !text) {
    return res.status(400).json({ error: 'chatId va text talab qilinadi.' });
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: parseMode }),
    });

    const dataRes = await response.json();
    if (!dataRes.ok) {
      return res.status(502).json({ error: 'Telegram API xatosi.', details: dataRes });
    }

    res.json({ ok: true, data: dataRes });
  } catch (error) {
    res.status(500).json({ error: 'Telegramga yuborib boʻlmadi.', details: error.message });
  }
});

app.post('/api/openai', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY yoʻq. .env fayliga qoʻshing.' });
  }

  const { messages, model = 'gpt-3.5-turbo', maxTokens = 500 } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array talab qilinadi.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model,
      messages,
      max_tokens: maxTokens,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'OpenAI soʻrovi xatosi.', details: error.message });
  }
});

app.post('/api/openai-image', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY yoʻq. .env fayliga qoʻshing.' });
  }

  const { base64, mediaType } = req.body;
  if (!base64 || !mediaType) {
    return res.status(400).json({ error: 'base64 va mediaType talab qilinadi.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Bu test varaqasi. Faqat JSON qaytar:\n{"subject":"Fan","totalQuestions":10,"wrongAnswers":[{"questionNumber":3,"topic":"Mavzu","studentAnswer":"B","correctAnswer":"A","explanation":"Izoh"}],"score":70,"summary":"Xulosa"}\nAgar aniq ko\'rinmasa ham namuna qaytar.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mediaType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    res.json({ response });
  } catch (error) {
    console.error('OpenAI image error:', error);
    res.status(500).json({ error: 'OpenAI image soʻrovi xatosi.', details: error.message });
  }
});

app.post('/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Barcha maydonlar toʻldirilishi kerak.' });
  }
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Bu email allaqachon roʻyxatdan oʻtgan.' });
  }

  const user = {
    id: data.nextUserId++,
    name,
    email,
    phone,
    passwordHash: hashPassword(password),
    settings: { lang: 'uz', notif: true, sound: true },
    history: [],
  };
  data.users.push(user);
  saveData(data);
  res.json(createAuthResponse(user));
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email va parol kerak.' });
  }

  const user = findUserByEmail(email);
  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Email yoki parol notoʻgʻri.' });
  }

  res.json(createAuthResponse(user));
});

app.get('/auth/me', authMiddleware, (req, res) => {
  res.json({ user: createPublicUser(req.user), settings: req.user.settings });
});

app.post('/auth/logout', authMiddleware, (req, res) => {
  delete data.sessions[req.token];
  saveData(data);
  res.json({ ok: true });
});

app.put('/user/profile', authMiddleware, (req, res) => {
  const { name, phone } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name va phone talab qilinadi.' });
  }

  req.user.name = name;
  req.user.phone = phone;
  saveData(data);
  res.json({ user: createPublicUser(req.user) });
});

app.put('/user/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Hozirgi va yangi parol kerak.' });
  }
  if (req.user.passwordHash !== hashPassword(currentPassword)) {
    return res.status(401).json({ error: 'Hozirgi parol notoʻgʻri.' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Yangi parol kamida 6 belgidan iborat boʻlishi kerak.' });
  }

  req.user.passwordHash = hashPassword(newPassword);
  saveData(data);
  res.json({ ok: true });
});

app.get('/user/settings', authMiddleware, (req, res) => {
  res.json({ settings: req.user.settings });
});

app.put('/user/settings', authMiddleware, (req, res) => {
  const { lang, notif, sound } = req.body || {};
  req.user.settings = {
    lang: lang || req.user.settings.lang,
    notif: notif !== undefined ? Boolean(notif) : req.user.settings.notif,
    sound: sound !== undefined ? Boolean(sound) : req.user.settings.sound,
  };
  saveData(data);
  res.json({ settings: req.user.settings });
});

app.get('/user/history', authMiddleware, (req, res) => {
  res.json({ history: req.user.history || [] });
});

app.post('/user/history', authMiddleware, (req, res) => {
  const item = req.body;
  if (!item || typeof item !== 'object' || !item.subject) {
    return res.status(400).json({ error: 'Yaroqli tarix elementi kerak.' });
  }
  const nextItem = { ...item, id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(12).toString('hex'), createdAt: new Date().toISOString() };
  req.user.history = [nextItem, ...(req.user.history || [])].slice(0, 50);
  saveData(data);
  res.json({ ok: true, history: req.user.history });
});

app.delete('/user/history', authMiddleware, (req, res) => {
  req.user.history = [];
  saveData(data);
  res.json({ ok: true });
});

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishlayapti`);
});
