import { useEffect } from 'react';

export default function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: '#1E293B', color: '#fff', borderRadius: 12, padding: '10px 20px',
      fontSize: 13, fontWeight: 600, zIndex: 9999, whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      {msg}
    </div>
  );
}
