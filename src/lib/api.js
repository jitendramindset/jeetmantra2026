const apiBase = import.meta.env.DEV ? 'http://localhost:3000/api' : '/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'API request failed');
  }

  return response.json();
}

export function login(email) {
  return fetchJson(`${apiBase}/login`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).then((response) => response.user);
}

export function fetchCourses() {
  return fetchJson(`${apiBase}/courses`).then((response) => response.data);
}

export function fetchServices() {
  return fetchJson(`${apiBase}/services`).then((response) => response.data);
}

export function fetchDashboard(userId, role) {
  return fetchJson(`${apiBase}/get_user_dashboard`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, role }),
  }).then((response) => response.data);
}
