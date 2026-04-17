import { C } from '../../assets/theme';

const V = {
  primary : { bg: `linear-gradient(135deg,${C.pl},${C.pd})`, cl: '#fff',    sh: '0 6px 20px rgba(99,102,241,0.35)' },
  danger  : { bg: '#FEE2E2',                                  cl: C.danger,  sh: 'none' },
  ghost   : { bg: 'transparent',                              cl: C.primary, sh: 'none' },
  outline : { bg: C.white,                                    cl: C.text,    sh: 'none' },
  success : { bg: `linear-gradient(135deg,${C.success},#059669)`, cl: '#fff', sh: '0 6px 16px rgba(16,185,129,0.3)' },
};

export default function Button({ children, onClick, disabled, variant = 'primary', small = false, style: sx = {} }) {
  const v = V[variant] || V.primary;
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      style={{
        width: '100%', padding: small ? '10px 16px' : '15px', borderRadius: 14,
        background: disabled ? '#E2E8F0' : v.bg, color: disabled ? '#94A3B8' : v.cl,
        fontSize: small ? 13 : 15, fontWeight: 700,
        border: variant === 'outline' ? `1.5px solid ${C.border}` : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: disabled ? 'none' : v.sh,
        transition: 'all 0.15s', display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 8, fontFamily: 'inherit', ...sx,
      }}>
      {children}
    </button>
  );
}
