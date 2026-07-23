async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (options.body && !(options.body instanceof Blob) && !(options.body instanceof ArrayBuffer)) headers['Content-Type'] = 'application/json';
  const response = await fetch(path, { credentials: 'include', ...options, headers });
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('The admin API is unavailable. Run the Firebase emulators or deploy the Firebase Functions backend.');
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || 'The request could not be completed.');
    error.status = response.status;
    error.fields = payload.fields;
    throw error;
  }
  return payload;
}

export const adminApi = {
  session: () => request('/api/admin/session'),
  login: (credentials) => request('/api/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  list: async (type) => {
    const payload = await request(`/api/admin/${type}`);
    if (!Array.isArray(payload?.items)) throw new Error('The admin API returned invalid content data.');
    return payload;
  },
  create: (type, item) => request(`/api/admin/${type}`, { method: 'POST', body: JSON.stringify(item) }),
  update: (type, id, item) => request(`/api/admin/${type}/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(item) }),
  remove: (type, id) => request(`/api/admin/${type}/${encodeURIComponent(id)}`, { method: 'DELETE' }),
};

export function uploadAdminImage({ file, folder, entityId, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const query = new URLSearchParams({ folder, entityId });
    xhr.open('POST', `/api/admin/uploads?${query}`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      const payload = JSON.parse(xhr.responseText || '{}');
      if (xhr.status >= 200 && xhr.status < 300) resolve(payload);
      else reject(new Error(payload.error || 'Image upload failed.'));
    };
    xhr.onerror = () => reject(new Error('Image upload failed.'));
    xhr.send(file);
  });
}
