const BASE_URL = 'http://localhost:5000';
const TOKEN_KEY = 'ait_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) setToken(null);
    throw new Error(data.error || data.message || 'Server xatosi.');
  }

  return data;
}

export function loginUser({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function registerUser({ name, email, phone, password }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, phone, password }),
  });
}

export function getCurrentUser() {
  return request('/auth/me');
}

export function logoutUser() {
  return request('/auth/logout', { method: 'POST' });
}

export function updateProfile(payload) {
  return request('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function changePassword(currentPassword, newPassword) {
  return request('/user/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export function getSettings() {
  return request('/user/settings');
}

export function saveSettings(settings) {
  return request('/user/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}

export function getHistory() {
  return request('/user/history');
}

export function addHistory(item) {
  return request('/user/history', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export function clearHistory() {
  return request('/user/history', { method: 'DELETE' });
}
