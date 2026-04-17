import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import { changePassword } from '../../hooks/authAPI';
import { C } from '../../assets/theme';

export default function ChangePasswordModal({ onClose, L }) {
  const [cur,  setCur]  = useState('');
  const [nw,   setNw]   = useState('');
  const [nw2,  setNw2]  = useState('');
  const [err,  setErr]  = useState('');
  const [done, setDone] = useState(false);

  const save = async () => {
    if (nw.length < 6)          { setErr(L.errPassShort); return; }
    if (nw !== nw2)             { setErr(L.errPassMatch);  return; }

    try {
      await changePassword(cur, nw);
      setDone(true);
      setTimeout(onClose, 1500);
    } catch (error) {
      setErr(error.message || L.errCurPass);
    }
  };

  if (done) {
    return (
      <Modal title={`🔒 ${L.mPass}`} onClose={onClose}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>✅</div>
          <p style={{ margin: 0, fontWeight: 700, color: C.success }}>{L.changed}</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`🔒 ${L.mPass}`} onClose={onClose}>
      <InputField label={L.curPass}     icon="🔒" type="password" ph={L.curPassPh}   val={cur}  onChange={e => setCur(e.target.value)}  />
      <InputField label={L.newPass}     icon="🔑" type="password" ph={L.newPassPh}   val={nw}   onChange={e => setNw(e.target.value)}   />
      <InputField label={L.confirmPass} icon="🔑" type="password" ph={L.passConfPh}  val={nw2}  onChange={e => setNw2(e.target.value)}  />

      {err && (
        <div style={{ background: '#FEE2E2', borderRadius: 10, padding: '10px 14px',
          marginBottom: 14, fontSize: 13, color: '#B91C1C', fontWeight: 600 }}>
          ⚠️ {err}
        </div>
      )}

      <Button onClick={save}>{L.save}</Button>
    </Modal>
  );
}
