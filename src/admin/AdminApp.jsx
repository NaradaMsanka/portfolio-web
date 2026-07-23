import { useCallback, useEffect, useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import { adminApi } from './services/adminApi';
import './admin.css';

export default function AdminApp() {
  const [session, setSession] = useState({ loading: true, username: '', error: '' });

  useEffect(() => {
    adminApi.session()
      .then(({ username }) => setSession({ loading: false, username, error: '' }))
      .catch((error) => setSession({ loading: false, username: '', error: error.status === 401 ? '' : error.message }));
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      // Local state must still be cleared if the session has already expired.
    } finally {
      setSession({ loading: false, username: '', error: '' });
    }
  }, []);

  if (session.loading) {
    return <main className="admin-session-loading"><div className="admin-loader-mark" aria-hidden="true"><i /><i /><i /></div><p>Checking administrator session</p></main>;
  }

  if (!session.username) {
    return <AdminLogin initialError={session.error} onAuthenticated={(username) => setSession({ loading: false, username, error: '' })} />;
  }

  return <AdminDashboard username={session.username} onLogout={logout} />;
}
