const BASE_URL = (import.meta.env.VITE_ANALYTICS_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

function getAuthHeader() {
  const token = localStorage.getItem('amar_hishab_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  getBaseUrl() {
    return BASE_URL;
  },

  isAuthenticated() {
    return !!localStorage.getItem('amar_hishab_admin_token');
  },

  async login(username, password) {
    const res = await fetch(`${BASE_URL}/v1/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    localStorage.setItem('amar_hishab_admin_token', data.token);
    localStorage.setItem('amar_hishab_admin_user', JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem('amar_hishab_admin_token');
    localStorage.removeItem('amar_hishab_admin_user');
  },

  getAdminUser() {
    try {
      const u = localStorage.getItem('amar_hishab_admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...(options.headers || {})
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (res.status === 401) {
      this.logout();
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw new Error('Session expired or unauthorized');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  getOverview() {
    return this.request('/v1/admin/overview');
  },

  getActivity(days = 30) {
    return this.request(`/v1/admin/activity?days=${days}`);
  },

  getVersions() {
    return this.request('/v1/admin/versions');
  },

  getFeatures() {
    return this.request('/v1/admin/features');
  },

  getPlatforms() {
    return this.request('/v1/admin/platforms');
  },

  getErrors() {
    return this.request('/v1/admin/errors');
  },

  getLive() {
    return this.request('/v1/admin/live');
  }
};
