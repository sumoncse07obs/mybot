import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, dashboardPathForRole, saveAuth } from '../../api/auth/auth';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const auth = await register(form);
      saveAuth(auth);
      navigate(dashboardPathForRole(auth.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-badge">BotAPI</span>
          <h1>Create account</h1>
          <p>New registration always becomes a normal user.</p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <label>
              First name
              <input value={form.first_name} onChange={(e) => updateField('first_name', e.target.value)} />
            </label>

            <label>
              Last name
              <input value={form.last_name} onChange={(e) => updateField('last_name', e.target.value)} />
            </label>
          </div>

          <label>
            Email
            <input value={form.email} onChange={(e) => updateField('email', e.target.value)} type="email" required />
          </label>

          <label>
            Password
            <input value={form.password} onChange={(e) => updateField('password', e.target.value)} type="password" required />
          </label>

          <label>
            Phone
            <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
          </label>

          <button disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        </form>

        <p className="auth-switch">
          Already have account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
