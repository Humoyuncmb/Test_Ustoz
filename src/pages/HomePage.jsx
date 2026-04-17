import Card      from '../components/ui/Card';
import Button    from '../components/ui/Button';
import NotifModal from '../components/modals/NotifModal';
import { useApp } from '../context/AppContext';
import { C }      from '../assets/theme';
import { useState } from 'react';

const LANG_KEY = { uz:'uz', ru:'ru', en:'en', kk:'kk' };
const GREETS = {
  uz: h => h<6?'🌙 Xayrli tun':h<12?'🌅 Xayrli tong':h<18?'☀️ Xayrli kun':'🌆 Xayrli kech',
  ru: h => h<6?'🌙 Доброй ночи':h<12?'🌅 Доброе утро':h<18?'☀️ Добрый день':'🌆 Добрый вечер',
  en: h => h<6?'🌙 Good night':h<12?'🌅 Good morning':h<18?'☀️ Good afternoon':'🌆 Good evening',
  kk: h => h<6?'🌙 Қайырлы түн':h<12?'🌅 Қайырлы таң':h<18?'☀️ Қайырлы күн':'🌆 Қайырлы кеш',
};

const sc = s => s >= 70 ? C.success : s >= 50 ? C.warn : C.danger;

export default function HomePage() {
  const { user, setAnalyzePage, lang, L, history } = useApp();
  const [showNotif, setShowNotif] = useState(false);

  const hour    = new Date().getHours();
  const greet   = (GREETS[lang] || GREETS.uz)(hour);
  const avg     = history.length
    ? Math.round(history.reduce((a, b) => a + (b.score || 0), 0) / history.length)
    : 0;
  const streak  = Math.min(history.length, 7);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.bg }}>
      {/* ── Hero header ──────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`,
        padding: '20px 20px 36px', borderRadius: '0 0 32px 32px' }}>

        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{greet}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: 21, fontWeight: 800, color: '#fff' }}>
              {user?.name?.split(' ')[0] || 'Foydalanuvchi'} 👋
            </h2>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => setShowNotif(true)}
              style={{ position: 'relative', background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: 13, width: 42, height: 42, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🔔
              {history.length > 0 && (
                <div style={{ position: 'absolute', top: 7, right: 7, width: 9, height: 9,
                  borderRadius: '50%', background: '#EF4444', border: '2px solid #5b5bd6' }} />
              )}
            </button>
            <div style={{ width: 42, height: 42, borderRadius: 14,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {user?.avatar || '👤'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { v: history.length,              l: L.histTitle  },
            { v: history.length ? avg+'%':'—', l: L.correctLbl },
            { v: streak+'🔥',                  l: 'Streak'    },
          ].map(s => (
            <div key={s.l} style={{ flex: 1, background: 'rgba(255,255,255,0.15)',
              borderRadius: 14, padding: '11px 8px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{s.v}</p>
              <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 16px 24px' }}>
        <div onClick={() => setAnalyzePage(true)}
          style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`,
            borderRadius: 22, padding: '22px 20px', marginBottom: 20, cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, flexShrink: 0 }}>📋</div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#fff' }}>{L.uploadTitle}</p>
            <p style={{ margin: '5px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{L.uploadSub}</p>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 11,
            background: 'rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>→</div>
        </div>

        <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: C.text }}>
          {L.histTitle}
        </h3>

        {history.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '36px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <p style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: C.sub }}>{L.noTests}</p>
            <Button onClick={() => setAnalyzePage(true)} small>{L.analyzeBtn}</Button>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {history.slice(0, 3).map((h, i) => (
              <Card key={h.id || i}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px' }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0 }}>📐</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.text }}>{h.subject}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 11, color: C.sub }}>
                    {new Date(h.date).toLocaleDateString()} · {h.totalQuestions} {L.totalLbl} · {h.wrongAnswers?.length || 0} {L.wrongLbl}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: sc(h.score) }}>{h.score}%</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showNotif && <NotifModal onClose={() => setShowNotif(false)} L={L} />}
    </div>
  );
}
