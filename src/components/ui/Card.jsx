import { C } from '../../assets/theme';

export default function Card({ children, style: sx = {}, onClick }) {
  return (
    <div onClick={onClick}
      style={{ background: C.white, borderRadius: 16, padding: '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: `1px solid ${C.border}`,
        cursor: onClick ? 'pointer' : 'default', ...sx }}>
      {children}
    </div>
  );
}
