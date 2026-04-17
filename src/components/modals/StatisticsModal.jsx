import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { C } from '../../assets/theme';

const scoreColor = s => s >= 70 ? C.success : s >= 50 ? C.warn : C.danger;

export default function StatisticsModal({ onClose, L }) {
  const { history } = useApp();
  const avg      = history.length ? Math.round(history.reduce((a, b) => a + (b.score || 0), 0) / history.length) : 0;
  const best     = history.length ? Math.max(...history.map(h => h.score || 0)) : 0;
  const worst    = history.length ? Math.min(...history.map(h => h.score || 0)) : 0;

  // Group by subject
  const subjects = {};
  history.forEach(h => {
    if (!subjects[h.subject]) subjects[h.subject] = { total: 0, count: 0 };
    subjects[h.subject].total += h.score || 0;
    subjects[h.subject].count += 1;
  });

  return (
    <Modal title={`📊 ${L.mStats}`} onClose={onClose}>
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px', color: C.sub }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <p style={{ margin: 0 }}>{L.noTests}</p>
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: L.histTitle,  value: history.length, icon: '📋', bg: '#EEF2FF', tc: C.primary },
              { label: L.correctLbl, value: avg  + '%',     icon: '📊', bg: '#F0FDF4', tc: C.success },
              { label: L.best,       value: best + '%',     icon: '🏆', bg: '#FFFBEB', tc: C.warn    },
              { label: L.wrongLbl,   value: worst + '%',    icon: '📉', bg: '#FEF2F2', tc: C.danger  },
            ].map(s => (
              <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: '14px' }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.tc }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 11, color: C.sub }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Per-subject progress bars */}
          {Object.entries(subjects).map(([subject, d]) => {
            const a = Math.round(d.total / d.count);
            return (
              <div key={subject} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{subject}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: scoreColor(a) }}>{a}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: '#E2E8F0' }}>
                  <div style={{ height: '100%', borderRadius: 4, background: scoreColor(a),
                    width: `${a}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </>
      )}
    </Modal>
  );
}
