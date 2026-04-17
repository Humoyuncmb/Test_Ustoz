import Card from '../ui/Card';
import { C } from '../../assets/theme';

const scoreColor = s => s >= 70 ? C.success : s >= 50 ? C.warn : C.danger;

export default function HistoryList({ histList, onView, onClear, L }) {
  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>
          📋 {L.histTitle}
        </h3>
        {histList.length > 0 && (
          <button onClick={() => { if (window.confirm(L.deleteConfirm)) onClear(); }}
            style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 9,
              padding: '5px 12px', fontSize: 12, fontWeight: 700, color: C.danger, cursor: 'pointer' }}>
            🗑️
          </button>
        )}
      </div>

      {/* Empty state */}
      {histList.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '24px', marginBottom: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
          <p style={{ margin: 0, fontSize: 13, color: C.sub }}>{L.noTests}</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 16 }}>
          {histList.map((h, i) => (
            <Card key={h.id || i} onClick={() => onView(h)}
              style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13,
                background: `${scoreColor(h.score)}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0 }}>📐</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.text }}>{h.subject}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: C.sub }}>
                  {new Date(h.date).toLocaleDateString()} · {h.wrongAnswers?.length || 0} {L.wrongLbl}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: scoreColor(h.score) }}>
                {h.score}%
              </p>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
