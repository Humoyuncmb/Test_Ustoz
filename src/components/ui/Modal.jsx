import { useEffect } from 'react';
import { C } from '../../assets/theme';

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 5000,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: C.white, borderRadius: '24px 24px 0 0', width: '100%',
        maxWidth: 600, maxHeight: '88vh', overflow: 'auto', animation: 'slideUp 0.25s ease' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`,
          position: 'sticky', top: 0, background: C.white, zIndex: 1 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: C.text }}>{title}</h3>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: 10,
            width: 36, height: 36, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
        <div style={{ padding: '16px 20px 40px' }}>{children}</div>
      </div>
    </div>
  );
}
