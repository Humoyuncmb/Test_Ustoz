import Card from '../ui/Card';
import { C } from '../../assets/theme';

export default function ProfileMenu({ items }) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }}>
      {items.map((m, i) => (
        <div key={i} onClick={m.onClick}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
            borderBottom: i < items.length - 1 ? `1px solid ${C.border}` : 'none',
            cursor: 'pointer', background: C.white }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: m.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0 }}>
            {m.icon}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{m.label}</p>
            <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{m.sub}</p>
          </div>
          <span style={{ color: C.sub, fontSize: 18 }}>›</span>
        </div>
      ))}
    </Card>
  );
}
