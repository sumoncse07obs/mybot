import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, dashboardPathForRole, saveAuth } from '@/api/auth/auth';

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
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-5 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="mb-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">Login</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in with an admin, customer, or user account.
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Email
            <input
              className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Password
            <input
              className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
            />
          </label>

          <button
            className="mt-1 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[15px] font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-65"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          No account?{' '}
          <Link to="/register" className="font-extrabold text-blue-600 hover:text-blue-700">
            Register as user
          </Link>
        </p>
      </section>
    </main>
  );
}
