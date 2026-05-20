const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'eventflow_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const api = {
  auth: {
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
  },
  users: {
    updateProfile: (body) =>
      request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  },
  events: {
    list: (tab) => request(tab ? `/events?tab=${tab}` : '/events'),
    get: (id) => request(`/events/${id}`),
    create: (body) => request('/events', { method: 'POST', body: JSON.stringify(body) }),
    update: (id, body) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id) => request(`/events/${id}`, { method: 'DELETE' }),
    finish: (id) => request(`/events/${id}/finish`, { method: 'PATCH' }),
    register: (id, responses) =>
      request(`/events/${id}/register`, {
        method: 'POST',
        body: JSON.stringify({ responses }),
      }),
    activity: () => request('/events/activity'),
  },
  ai: {
    eventCopy: (body) =>
      request('/ai/event-copy', { method: 'POST', body: JSON.stringify(body) }),
    registrationFields: (body) =>
      request('/ai/registration-fields', { method: 'POST', body: JSON.stringify(body) }),
    recommendations: () => request('/ai/recommendations'),
  },
};
