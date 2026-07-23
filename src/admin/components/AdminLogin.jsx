import { AlertCircle, LockKeyhole, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../components/Logo';
import { adminApi } from '../services/adminApi';

export default function AdminLogin({ initialError = '', onAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(initialError);
  const [submitting, setSubmitting] = useState(false);

  function change(event) {
    setCredentials((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const result = await adminApi.login(credentials);
      onAuthenticated(result.username);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-brand"><Logo light /><p>Secure content administration</p></section>
      <form className="admin-login-panel" onSubmit={submit}>
        <span className="admin-kicker">Administrator access</span>
        <h1>Sign in to continue</h1>
        <p>Use the administrator credentials configured for this Firebase project.</p>
        <label><span>Username</span><div className="admin-input-wrap"><User size={18} /><input name="username" value={credentials.username} onChange={change} autoComplete="username" required autoFocus /></div></label>
        <label><span>Password</span><div className="admin-input-wrap"><LockKeyhole size={18} /><input type="password" name="password" value={credentials.password} onChange={change} autoComplete="current-password" required /></div></label>
        {error && <div className="admin-alert error" role="alert"><AlertCircle size={17} /><span>{error}</span></div>}
        <button className="admin-primary-button" type="submit" disabled={submitting}><LogIn size={18} />{submitting ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </main>
  );
}
