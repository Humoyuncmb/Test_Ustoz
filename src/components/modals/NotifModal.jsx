import Modal from '../ui/Modal';
import { useApp } from '../../context/AppContext';

export default function NotifModal({ onClose, L }) {
  const { history } = useApp();
  const notifs = [
    ...(history.length > 0 ? [{ icon: '🎯', title: `${history[0].subject}: ${history[0].score}%`, sub: L.histTitle, time: 'Yaqinda', bg: '#EEF2FF' }] : []),
    { icon: '🎓', title: 'Yangi darslar', sub: 'Barcha fanlar yangilangan', time: 'Bugun', bg: '#F0FDF4' },
    { icon: '⭐', title: "Muntazam o'qing!", sub: 'Har kuni 15 daqiqa', time: 'Eslatma', bg: '#FFFBEB' },
  ];
  return (
    <Modal title={L.notifTitle} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 13,
            borderRadius: 14, background: n.bg }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{n.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{n.title}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: '#64748B' }}>{n.sub}</p>
            </div>
            <span style={{ fontSize: 10, color: '#64748B' }}>{n.time}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
