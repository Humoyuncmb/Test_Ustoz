import { C } from '../../assets/theme';

export default function ProfileHeader({ user, histList, L, onEdit }) {
  const avg  = histList.length ? Math.round(histList.reduce((a, b) => a + (b.score || 0), 0) / histList.length) : 0;
  const best = histList.length ? Math.max(...histList.map(h => h.score || 0)) : 0;

  return (
    <div style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`,
      padding: '26px 20px 36px', borderRadius: '0 0 32px 32px' }}>

      {/* User info row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
        <div style={{ width: 68, height: 68, borderRadius: 22,
          background: 'rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 34, flexShrink: 0,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          border: '2px solid rgba(255,255,255,0.3)' }}>
          {user?.avatar || '👤'}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>{user?.name}</h2>
          <p style={{ margin: '4px 0 2px', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{user?.email}</p>
          {user?.phone && <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{user.phone}</p>}
        </div>
        <button onClick={onEdit}
          style={{ background: 'rgba(255,255,255,0.22)', border: 'none', borderRadius: 11,
            width: 38, height: 38, cursor: 'pointer', color: '#fff', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          ✏️
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { v: histList.length, l: L.histTitle  },
          { v: avg  + '%',      l: L.correctLbl },
          { v: best + '%',      l: L.best       },
        ].map(({ v, l }) => (
          <div key={l} style={{ flex: 1, textAlign: 'center',
            background: 'rgba(255,255,255,0.16)', borderRadius: 13, padding: '10px 6px' }}>
            <p style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff' }}>{v}</p>
            <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
