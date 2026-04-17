import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import Button     from '../components/ui/Button';
import InputField from '../components/ui/InputField';
import Spinner    from '../components/ui/Spinner';
import { useApp } from '../context/AppContext';
import { registerUser } from '../hooks/authAPI';
import { C }      from '../assets/theme';

export default function RegisterPage({ onGoLogin }) {
  const { login, L } = useApp();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [pass,     setPass]     = useState('');
  const [pass2,    setPass2]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim())         e.name   = L.errName;
    if (!email.includes('@')) e.email  = L.errEmail;
    if (phone.length < 7)     e.phone  = L.errPhone;
    if (pass.length < 6)      e.pass   = L.errPass;
    if (pass !== pass2)       e.pass2  = L.errPass2;
    if (!agreed)              e.agreed = L.errAgree;
    return e;
  };

  const doRegister = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true); setErrors({});
    try {
      const data = await registerUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: pass,
      });
      login(data);
    } catch (err) {
      const message = err.message || 'Server xatosi.';
      setErrors({ form: message });
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`,
        padding: '16px 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onGoLogin}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10,
              width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>{L.regTitle}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{L.regSub}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '24px 20px 40px' }}>
        <div style={{ background: '#EEF2FF', borderRadius: 14, padding: '12px 14px',
          marginBottom: 20, fontSize: 12, color: '#4338CA', fontWeight: 500, lineHeight: 1.5 }}>
          {L.regHint}
        </div>

        <InputField label={L.nameLabel}  icon="👤" ph={L.namePh}  val={name}  onChange={e => setName(e.target.value)}  err={errors.name}  />
        <InputField label={L.emailReq}   icon="✉️" ph={L.emailPh} val={email} onChange={e => setEmail(e.target.value)} err={errors.email} />
        <InputField label={L.phoneLabel} icon="📞" ph={L.phonePh} val={phone} onChange={e => setPhone(e.target.value)} err={errors.phone} />
        <InputField label={L.passReq} icon="🔒"
          type={showPass ? 'text' : 'password'} ph={L.passPh2}
          val={pass} onChange={e => setPass(e.target.value)} err={errors.pass}
          right={<span onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁️'}</span>} />
        <InputField label={L.passConf} icon="🔒"
          type={showPass ? 'text' : 'password'} ph={L.passConfPh}
          val={pass2} onChange={e => setPass2(e.target.value)} err={errors.pass2} />

        {/* Terms checkbox */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
          marginBottom: errors.agreed ? 4 : 20 }}>
          <div onClick={() => setAgreed(v => !v)}
            style={{ width: 22, height: 22, borderRadius: 6,
              border: `2px solid ${agreed ? C.primary : C.border}`,
              background: agreed ? C.primary : '#fff',
              cursor: 'pointer', flexShrink: 0, marginTop: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s' }}>
            {agreed && <span style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>✓</span>}
          </div>
          <span style={{ fontSize: 12.5, color: C.sub, lineHeight: 1.6, cursor: 'pointer' }}
            onClick={() => setAgreed(v => !v)}>
            <span style={{ color: C.primary, fontWeight: 600 }}>{L.terms}</span> {L.and}{' '}
            <span style={{ color: C.primary, fontWeight: 600 }}>{L.privacy}</span>{L.agree}
          </span>
        </div>
        {errors.agreed && (
          <p style={{ margin: '0 0 16px', fontSize: 11, color: C.danger, fontWeight: 600 }}>
            ⚠️ {errors.agreed}
          </p>
        )}
        {errors.form && (
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>
            ⚠️ {errors.form}
          </p>
        )}

        <Button onClick={doRegister} disabled={loading || !agreed}>
          {loading ? <><Spinner /> {L.creating}</> : L.createBtn}
        </Button>

        <p style={{ textAlign: 'center', fontSize: 13, color: C.sub, marginTop: 20 }}>
          {L.hasAcc}{' '}
          <span onClick={onGoLogin} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>
            {L.goLogin}
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
