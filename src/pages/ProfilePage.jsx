import { useState }            from 'react';
import Button                   from '../components/ui/Button';
import Toast                    from '../components/ui/Toast';
import ProfileHeader             from '../components/profile/ProfileHeader';
import ProfileMenu               from '../components/profile/ProfileMenu';
import HistoryList               from '../components/profile/HistoryList';
import EditProfileModal          from '../components/modals/EditProfileModal';
import ChangePasswordModal       from '../components/modals/ChangePasswordModal';
import StatisticsModal           from '../components/modals/StatisticsModal';
import NotifModal                from '../components/modals/NotifModal';
import LanguageModal             from '../components/modals/LanguageModal';
import HelpModal                 from '../components/modals/HelpModal';
import SettingsModal             from '../components/modals/SettingsModal';
import { useApp }                from '../context/AppContext';
import { updateProfile, clearHistory } from '../hooks/authAPI';
import { C }                     from '../assets/theme';

const LANG_NAMES = { uz:"O'zbek tili", ru:'Русский', en:'English', kk:'Қазақ тілі' };

export default function ProfilePage() {
  const { user, updateUser, logout, lang, changeLang, L, history, refreshHistory, settings, saveAppSettings } = useApp();

  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');

  const saveSettings = s => {
    saveAppSettings(s);
    setToast('✅ Saqlandi');
  };

  const handleClearHistory = async () => {
    if (!window.confirm(L.deleteConfirm)) return;
    try {
      await clearHistory();
      refreshHistory();
      setToast('✅ O‘chirildi');
    } catch {
      setToast('⚠️ Xato yuz berdi');
    }
  };

  const menuItems = [
    { icon: '📊', label: L.mStats,    sub: L.mStatsSub,    color: '#EEF2FF', onClick: () => setModal('stats')    },
    { icon: '🔔', label: L.mNotif,    sub: L.mNotifSub,    color: '#FFF7ED', onClick: () => setModal('notif')    },
    { icon: '🔒', label: L.mPass,     sub: L.mPassSub,     color: '#FEF2F2', onClick: () => setModal('password') },
    { icon: '⚙️', label: L.mSettings, sub: L.mSettingsSub, color: '#F0FDF4', onClick: () => setModal('settings') },
    { icon: '🌐', label: L.mLang,     sub: LANG_NAMES[lang], color: '#EEF2FF', onClick: () => setModal('lang')  },
    { icon: '💬', label: L.mHelp,     sub: L.mHelpSub,     color: '#F0F4FF', onClick: () => setModal('help')    },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.bg }}>
      <ProfileHeader
        user={user}
        histList={history}
        L={L}
        onEdit={() => setModal('edit')}
      />

      <div style={{ padding: '16px' }}>
        <HistoryList
          histList={history}
          L={L}
          onView={() => {}}
          onClear={handleClearHistory}
        />

        <ProfileMenu items={menuItems} />

        <Button
          variant="danger"
          onClick={() => { if (window.confirm(L.logoutConfirm)) logout(); }}>
          🚪 {L.logout}
        </Button>

        <p style={{ textAlign: 'center', fontSize: 11, color: C.sub, marginTop: 14 }}>
          {L.footer}
        </p>
      </div>

      {modal === 'edit' && (
        <EditProfileModal
          user={user}
          L={L}
          onSave={async u => {
            try {
              const data = await updateProfile(u);
              updateUser(data.user);
              setModal(null);
              setToast('✅ Saqlandi');
            } catch {
              setToast('⚠️ Xato yuz berdi');
            }
          }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'password' && (
        <ChangePasswordModal user={user} L={L} onClose={() => setModal(null)} />
      )}
      {modal === 'stats' && (
        <StatisticsModal L={L} onClose={() => setModal(null)} />
      )}
      {modal === 'notif' && (
        <NotifModal L={L} onClose={() => setModal(null)} />
      )}
      {modal === 'lang' && (
        <LanguageModal
          currentLang={lang}
          onSave={l => { changeLang(l); setModal(null); setToast('✅ Til o\'zgartirildi'); }}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'help' && (
        <HelpModal L={L} onClose={() => setModal(null)} />
      )}
      {modal === 'settings' && (
        <SettingsModal
          settings={settings}
          L={L}
          onSave={saveSettings}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} />}
    </div>
  );
}
