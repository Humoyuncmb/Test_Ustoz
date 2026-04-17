import { createContext, useContext, useState, useEffect } from 'react';
import TR from '../assets/translations';
import { getCurrentUser, getHistory, saveSettings, setToken } from '../hooks/authAPI';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [screen,      setScreen]      = useState('splash');
  const [user,        setUserState]   = useState(null);
  const [tab,         setTab]         = useState('home');
  const [lang,        setLangState]   = useState('uz');
  const [analyzePage, setAnalyzePage] = useState(false);
  const [history,     setHistory]     = useState([]);
  const [settings,    setSettings]    = useState({ lang: 'uz', notif: true, sound: true });

  const L = TR[lang] || TR.uz;

  const refreshHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data.history || []);
    } catch {
      setHistory([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('ait_token');
    if (!token) {
      setTimeout(() => setScreen('login'), 2200);
      return;
    }

    getCurrentUser().then(data => {
      setUserState(data.user);
      setSettings(data.settings || { lang: 'uz', notif: true, sound: true });
      setLangState(data.settings?.lang || 'uz');
      setScreen('main');
      refreshHistory();
    }).catch(() => {
      setToken(null);
      setScreen('login');
    });
  }, []);

  const login = authData => {
    if (!authData) return;
    setToken(authData.token);
    setUserState(authData.user);
    setSettings(authData.settings || { lang: 'uz', notif: true, sound: true });
    setLangState(authData.settings?.lang || 'uz');
    setScreen('main');
    setTab('home');
    refreshHistory();
  };

  const logout = () => {
    setToken(null);
    setUserState(null);
    setScreen('login');
    setTab('home');
    setAnalyzePage(false);
    setHistory([]);
  };

  const updateUser = u => {
    setUserState({ ...u });
  };

  const changeLang = l => {
    const nextSettings = { ...settings, lang: l };
    setLangState(l);
    setSettings(nextSettings);
    if (user) {
      saveSettings(nextSettings).catch(() => {});
    }
  };

  const saveAppSettings = s => {
    setSettings(s);
    if (user) {
      saveSettings(s).catch(() => {});
    }
  };

  return (
    <Ctx.Provider value={{ screen, setScreen, user, login, logout, updateUser, tab, setTab, lang, changeLang, L, analyzePage, setAnalyzePage, history, refreshHistory, settings, saveAppSettings }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => useContext(Ctx);
