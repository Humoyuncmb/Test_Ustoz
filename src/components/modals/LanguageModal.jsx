import { useState } from 'react';
import Modal from '../ui/Modal';
import { C } from '../../assets/theme';

const LANGS = [
  { code: 'uz', name: "O'zbek tili", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский',     flag: '🇷🇺' },
  { code: 'en', name: 'English',     flag: '🇬🇧' },
  { code: 'kk', name: 'Қазақ тілі', flag: '🇰🇿' },
];

export default function LanguageModal({ currentLang, onSave, onClose }) {
  const [sel, setSel] = useState(currentLang || 'uz');

  const pick = code => {
    setSel(code);
    onSave(code);
  };

  return (
    <Modal title="🌐 Til / Language" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {LANGS.map(l => (
          <div key={l.code} onClick={() => pick(l.code)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              borderRadius: 14, cursor: 'pointer',
              background: sel === l.code ? '#EEF2FF' : '#F8FAFF',
              border: `1.5px solid ${sel === l.code ? C.primary : C.border}` }}>
            <span style={{ fontSize: 28 }}>{l.flag}</span>
            <span style={{ flex: 1, fontWeight: sel === l.code ? 700 : 500,
              fontSize: 14, color: sel === l.code ? C.primary : C.text }}>
              {l.name}
            </span>
            {sel === l.code && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#fff', fontWeight: 800 }}>✓</div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
