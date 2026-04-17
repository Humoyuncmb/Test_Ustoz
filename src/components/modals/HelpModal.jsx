import { useState } from 'react';
import Modal from '../ui/Modal';
import { C } from '../../assets/theme';

export default function HelpModal({ onClose, L }) {
  const [open, setOpen] = useState(null);
  const faqs = L.faq || [];

  return (
    <Modal title={L.helpTitle} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {/* Question row */}
            <div onClick={() => setOpen(open === i ? null : i)}
              style={{ padding: '13px 16px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: open === i ? '#EEF2FF' : C.white }}>
              <span style={{ fontSize: 13, fontWeight: 600, flex: 1, lineHeight: 1.4,
                color: open === i ? C.primary : C.text }}>{f.q}</span>
              <span style={{ fontSize: 18, color: C.sub, marginLeft: 8 }}>
                {open === i ? '▲' : '▽'}
              </span>
            </div>
            {/* Answer */}
            {open === i && (
              <div style={{ padding: '12px 16px', background: '#F8FAFF',
                fontSize: 13, color: C.sub, lineHeight: 1.6,
                borderTop: `1px solid ${C.border}` }}>
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </Modal>
  );
}
