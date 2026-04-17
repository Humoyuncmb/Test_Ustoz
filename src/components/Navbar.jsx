import { C } from '../assets/theme';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { tab, setTab, setAnalyzePage, L } = useApp();

  const go = t => { setTab(t); setAnalyzePage(false); };

  return (
    <nav style={{ height: 68, background: C.white, borderTop: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'stretch', flexShrink: 0, zIndex: 100 }}>

      {/* Home */}
      <NavItem active={tab === 'home'} onClick={() => go('home')}>
        <span style={{ fontSize: 22 }}>🏠</span>
        <span style={{ fontSize: 10, fontWeight: tab === 'home' ? 700 : 500 }}>{L.homeTitle}</span>
      </NavItem>

      {/* Analyze — raised center button */}
      <button onClick={() => setAnalyzePage(true)}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 3, background: 'none', border: 'none',
          cursor: 'pointer', color: C.sub, padding: 0, fontFamily: 'inherit' }}>
        <div style={{ width: 52, height: 52, borderRadius: 18,
          background: `linear-gradient(135deg,${C.pl},${C.pd})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: -26, boxShadow: '0 6px 20px rgba(99,102,241,0.5)', fontSize: 24 }}>
          <span style={{ filter: 'brightness(10)' }}>📊</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 500, marginTop: 1 }}>{L.analyzeTitle}</span>
      </button>

      {/* Profile */}
      <NavItem active={tab === 'profile'} onClick={() => go('profile')}>
        <span style={{ fontSize: 22 }}>👤</span>
        <span style={{ fontSize: 10, fontWeight: tab === 'profile' ? 700 : 500 }}>{L.profileTitle}</span>
      </NavItem>

    </nav>
  );
}

function NavItem({ children, active, onClick }) {
  const { C: _ } = { C };
  return (
    <button onClick={onClick}
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 3, background: 'none', border: 'none',
        cursor: 'pointer', color: active ? C.primary : C.sub, padding: 0, fontFamily: 'inherit' }}>
      {children}
    </button>
  );
}
