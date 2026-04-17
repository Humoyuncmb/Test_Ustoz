import { useState } from 'react';
import { C } from '../../assets/theme';

export default function InputField({ label, icon, type = 'text', ph, val, onChange, right, err }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 6, display: 'block' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>{icon}</span>}
        <input type={type} placeholder={ph} value={val} onChange={onChange}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', padding: `13px ${right ? '44px' : '14px'} 13px ${icon ? '42px' : '14px'}`,
            borderRadius: 12, border: `1.5px solid ${err ? C.danger : focused ? C.pl : C.border}`,
            fontSize: 14, background: C.white, outline: 'none', boxSizing: 'border-box',
            fontFamily: 'inherit', color: C.text,
            boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
          }} />
        {right && <span style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 16, cursor: 'pointer' }}>{right}</span>}
      </div>
      {err && <p style={{ margin: '4px 0 0', fontSize: 11, color: C.danger, fontWeight: 600 }}>{err}</p>}
    </div>
  );
}
