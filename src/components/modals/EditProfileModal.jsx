import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';

const AVATARS = ['👨‍🎓','👩‍🎓','🧑‍💻','👨‍🏫','👩‍🏫','🦊','🐬','🦁','🦅','🌟','🎯','🚀'];

export default function EditProfileModal({ user, onSave, onClose, L }) {
  const [name,   setName]   = useState(user?.name   || '');
  const [phone,  setPhone]  = useState(user?.phone  || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👨‍🎓');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ ...user, name: name.trim(), phone: phone.trim(), avatar });
  };

  return (
    <Modal title="✏️ Profilni tahrirlash" onClose={onClose}>
      {/* Avatar picker */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 76, height: 76, borderRadius: 24, background: '#EEF2FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, margin: '0 auto 14px', boxShadow: '0 4px 16px rgba(99,102,241,0.2)' }}>
          {avatar}
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: '#64748B' }}>
          Avatar tanlang:
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
          {AVATARS.map(a => (
            <button key={a} onClick={() => setAvatar(a)}
              style={{ width: 44, height: 44, borderRadius: 13, fontSize: 22, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: avatar === a ? '2.5px solid #4F46E5' : '2px solid #E2E8F0',
                background: avatar === a ? '#EEF2FF' : '#F8FAFF' }}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <InputField
        label={L.nameLabel || 'Ism familiya'}
        icon="👤"
        ph={L.namePh || 'Ismingiz'}
        val={name}
        onChange={e => setName(e.target.value)}
      />
      <InputField
        label={L.phoneLabel || 'Telefon'}
        icon="📞"
        ph={L.phonePh || '+998 90 000 00 00'}
        val={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <Button onClick={handleSave}>{L.save}</Button>
    </Modal>
  );
}
