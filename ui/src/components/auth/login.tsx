import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, dashboardPathForRole, saveAuth } from '../../api/auth/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = await login({ email, password });
      saveAuth(auth);
      navigate(dashboardPathForRole(auth.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <h1>Login</h1>
          <p>Sign in with an admin, customer, or user account.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </label>

          <label>
            Password
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </label>

          <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>

        <p className="auth-switch">
          No account? <Link to="/register">Register as user</Link>
        </p>

      </div>
    </div>
  );
}
