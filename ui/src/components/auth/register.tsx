import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, dashboardPathForRole, saveAuth } from '@/api/auth/auth';

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
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_32%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-5 py-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <div className="mb-6">
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-600">
            BotAPI
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">Create account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            New registration always becomes a normal user.
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              First name
              <input
                className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                value={form.first_name}
                onChange={(event) => updateField('first_name', event.target.value)}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Last name
              <input
                className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                value={form.last_name}
                onChange={(event) => updateField('last_name', event.target.value)}
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Email
            <input
              className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              type="email"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Password
            <input
              className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              type="password"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-bold text-slate-700">
            Phone
            <input
              className="h-12 rounded-2xl border border-slate-300 px-4 text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
            />
          </label>

          <button
            className="mt-1 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-4 text-[15px] font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-65"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have account?{' '}
          <Link to="/login" className="font-extrabold text-blue-600 hover:text-blue-700">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
