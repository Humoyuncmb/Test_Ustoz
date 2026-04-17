import { useEffect } from 'react';
import { C } from '../assets/theme';

export default function SplashPage({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{ flex: 1,
      background: 'linear-gradient(160deg,#312e81,#4f46e5,#0891b2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden' }}>

      {/* Concentric background rings */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ position: 'absolute', borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          width: 80 + i * 80, height: 80 + i * 80,
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      ))}

      {/* Logo */}
      <div style={{ width: 100, height: 100, borderRadius: 30,
        background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
        animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both', zIndex: 1,
        border: '1px solid rgba(255,255,255,0.2)' }}>
        <span style={{ fontSize: 50 }}>🎓</span>
      </div>

      <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, color: '#fff',
        letterSpacing: -1, animation: 'fadeUp 0.5s 0.2s both', zIndex: 1 }}>
        AI Ta'lim
      </h1>
      <p style={{ margin: '10px 0 0', fontSize: 15, color: 'rgba(255,255,255,0.75)',
        fontWeight: 500, animation: 'fadeUp 0.5s 0.4s both', zIndex: 1 }}>
        Aqlli o'qituvchingiz doim yoningizda
      </p>

      {/* Dots indicator */}
      <div style={{ marginTop: 52, display: 'flex', gap: 7,
        animation: 'fadeUp 0.5s 0.7s both', zIndex: 1 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: i === 1 ? 28 : 8, height: 8, borderRadius: 4,
            background: i === 1 ? '#fff' : 'rgba(255,255,255,0.35)' }} />
        ))}
      </div>
    </div>
  );
}
