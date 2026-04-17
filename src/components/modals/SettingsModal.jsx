import { useState } from 'react';
import Modal from '../ui/Modal';
import { C } from '../../assets/theme';

export default function SettingsModal({ settings, onSave, onClose, L }) {
  const [s, setS] = useState({ ...settings });

  const toggle = key => {
    const next = { ...s, [key]: !s[key] };
    setS(next);
    onSave(next);
  };

  const rows = [
    { key: 'notif', icon: '🔔', label: L.sNotif, sub: L.sNotifSub },
    { key: 'sound', icon: '🔊', label: L.sSound, sub: L.sSoundSub },
  ];

  return (
    <Modal title={`⚙️ ${L.mSettings}`} onClose={onClose}>
      <div style={{ background: C.white, borderRadius: 16, overflow: 'hidden',
        border: `1px solid ${C.border}` }}>
        {rows.map((r, i) => (
          <div key={r.key}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            {/* Icon */}
            <div style={{ width: 38, height: 38, borderRadius: 11, background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
            {/* Label */}
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{r.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{r.sub}</p>
            </div>
            {/* Toggle */}
            <div onClick={() => toggle(r.key)}
              style={{ width: 48, height: 26, borderRadius: 13, cursor: 'pointer',
                background: s[r.key] ? C.primary : '#CBD5E1',
                transition: 'background 0.2s', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3,
                left: s[r.key] ? '24px' : '3px', width: 20, height: 20,
                borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
