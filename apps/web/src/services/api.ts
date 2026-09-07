/*!
 * Developer: Tejas Kamble
 * Email: tejaskgm1@gmail.com
 * Website: https://tejas-personal-portfolio-dev.vercel.app/
 * LinkedIn: https://www.linkedin.com/in/tejas-kamble-5342443b1
 * Instagram: @tejask.co.in
 * GitHub: https://github.com/tejasworkspacews1-ui
 *
 * Project Disclaimer:
 * All project data shown/accessed is completely legal, free and publicly
 * accessible data and not proprietary data.
 */
export const API_BASE = 'https://devsandboxcodeeditor.onrender.com/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('devsandbox_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}

export const api = {
  signup: (email: string, password: string, name: string) =>
    request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  
  signin: (email: string, password: string) =>
    request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  signout: () =>
    request('/auth/signout', { method: 'POST' }),
  
  getMe: () =>
    request('/auth/me'),
  
  getProjects: () =>
    request('/projects'),
  
  createProject: (project: any) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }),
  
  updateProject: (id: string, updates: any) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
  
  deleteProject: (id: string) =>
    request(`/projects/${id}`, { method: 'DELETE' }),
  
  shareProject: (id: string, permission: string) =>
    request(`/projects/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ permission }),
    }),
};

