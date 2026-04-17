import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Button     from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Spinner    from '../components/ui/Spinner';
import { useApp } from '../context/AppContext';
import { loginUser } from '../hooks/authAPI';
import { C }      from '../assets/theme';

export default function LoginPage({ onGoRegister }) {
  const { login, L } = useApp();

  const [email,    setEmail]    = useState('');
  const [pass,     setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const doLogin = async () => {
    if (!email.trim() || !pass.trim()) { setError(L.errFill); return; }
    setLoading(true); setError('');
    try {
      const data = await loginUser({ email: email.trim(), password: pass });
      login(data);
    } catch (err) {
      setError(err.message || L.errCreds);
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true); setError('');
    try {
      const data = await loginUser({ email: 'demo@ait.uz', password: 'demo123' });
      login(data);
    } catch (err) {
      setError(err.message || L.errCreds);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Hero header */}
      <div style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`,
        padding: '52px 24px 44px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', borderRadius: '0 0 32px 32px' }}>
        <div style={{ width: 84, height: 84, borderRadius: 26,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 40, marginBottom: 20,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.15)' }}>🎓</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#fff' }}>{L.welcome}</h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.8)',
          textAlign: 'center', lineHeight: 1.5 }}>{L.welcomeSub}</p>
      </div>

      {/* Form */}
      <div style={{ padding: '28px 20px 32px' }}>
        <InputField label={L.emailLabel} icon="✉️" ph={L.emailPh}
          val={email} onChange={e => setEmail(e.target.value)} />

        <InputField label={L.passLabel} icon="🔒"
          type={showPass ? 'text' : 'password'} ph={L.passPh}
          val={pass} onChange={e => setPass(e.target.value)}
          right={<span onClick={() => setShowPass(v => !v)}>{showPass ? '' : ''}</span>} />

        <div style={{ textAlign: 'right', margin: '-8px 0 20px' }}>
          <span style={{ fontSize: 12, color: C.primary, fontWeight: 600, cursor: 'pointer' }}>
            {L.forgotPass}
          </span>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA',
            borderRadius: 12, padding: '10px 14px', marginBottom: 16,
            fontSize: 13, color: '#B91C1C', fontWeight: 600,
            display: 'flex', gap: 8, alignItems: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <Button onClick={doLogin} disabled={loading}>
          {loading ? <><Spinner /> {L.loggingIn}</> : L.loginBtn}
        </Button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 11, color: C.sub, fontWeight: 700, letterSpacing: 1 }}>{L.orText}</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Demo login */}
        <button onClick={demoLogin}
          style={{ width: '100%', padding: '14px', borderRadius: 14, background: C.white,
            border: `1.5px solid ${C.border}`, fontSize: 14, fontWeight: 700, color: C.text,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, fontFamily: 'inherit', marginBottom: 20,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {L.demoBtn}
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.sub }}>
          {L.noAcc}{' '}
          <span onClick={onGoRegister}
            style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>
            {L.goReg}
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
