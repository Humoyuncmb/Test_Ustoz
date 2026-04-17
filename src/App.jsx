import { AppProvider, useApp } from './context/AppContext';
import { GLOBAL_CSS }          from './assets/theme';
import AppShell                from './layouts/AppShell';
import SplashPage              from './pages/SplashPage';
import LoginPage               from './pages/LoginPage';
import RegisterPage            from './pages/RegisterPage';
import HomePage                from './pages/HomePage';
import AnalyzePage             from './pages/AnalyzePage';
import ProfilePage             from './pages/ProfilePage';

// ── Inner app (needs context) ─────────────────────────────────────────────────
function Inner() {
  const { screen, setScreen, tab, analyzePage } = useApp();

  // Which "main" page to render
  const renderMain = () => {
    if (analyzePage) return <AnalyzePage />;
    switch (tab) {
      case 'home':    return <HomePage />;
      case 'profile': return <ProfilePage />;
      default:        return <HomePage />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      background: '#F0F4FF', maxWidth: 600, margin: '0 auto',
      boxShadow: '0 0 40px rgba(0,0,0,0.12)' }}>

      {/* Inject global keyframe animations */}
      <style>{GLOBAL_CSS}</style>

      {/* ── Screens ── */}
      {screen === 'splash' && (
        <SplashPage onDone={() => setScreen('login')} />
      )}

      {screen === 'login' && (
        <LoginPage onGoRegister={() => setScreen('register')} />
      )}

      {screen === 'register' && (
        <RegisterPage onGoLogin={() => setScreen('login')} />
      )}

      {screen === 'main' && (
        <AppShell>
          {renderMain()}
        </AppShell>
      )}
    </div>
  );
}

// ── Root export — wraps everything in context ────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
