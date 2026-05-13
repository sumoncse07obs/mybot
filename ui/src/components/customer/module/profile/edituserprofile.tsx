import { FormEvent, useEffect, useState } from 'react';
import { getAuthUser } from '@/api/auth/auth';
import type { AuthUser } from '@/types';
import { changeProfilePassword, getProfile, updateProfile } from '@/components/customer/module/profile/api/userapi';

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

const inputClass =
  'mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

export default function EditUserProfile() {
  const [user, setUser] = useState<AuthUser | null>(getAuthUser());
  const [form, setForm] = useState<ProfileForm>(() => ({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }));

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function syncForm(nextUser: AuthUser | null) {
    setForm({
      first_name: nextUser?.first_name || '',
      last_name: nextUser?.last_name || '',
      email: nextUser?.email || '',
      phone: nextUser?.phone || '',
    });
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError('');

        const data = await getProfile();
        setUser(data);
        syncForm(data);
      } catch (err) {
        const localUser = getAuthUser();
        setUser(localUser);
        syncForm(localUser);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const updatedUser = await updateProfile({
        first_name: form.first_name.trim() || null,
        last_name: form.last_name.trim() || null,
        phone: form.phone.trim() || null,
      });

      setUser(updatedUser);
      syncForm(updatedUser);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      setError('');
      setSuccess('');

      await changeProfilePassword({
        current_password: '',
        new_password: newPassword,
      });

      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Password changed successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="py-6 text-center text-slate-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Personal Information</h2>
            <p className="mt-1 text-sm text-slate-600">Update your name and phone number.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSaveProfile}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-900">
                First Name
                <input
                  className={inputClass}
                  value={form.first_name}
                  onChange={(event) => setForm({ ...form, first_name: event.target.value })}
                  placeholder="First name"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Last Name
                <input
                  className={inputClass}
                  value={form.last_name}
                  onChange={(event) => setForm({ ...form, last_name: event.target.value })}
                  placeholder="Last name"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Email
                <input
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  value={form.email}
                  disabled
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Phone
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  placeholder="Phone number"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => syncForm(user)}
              >
                Reset
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </section>

        <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">Change Password</h2>
            <p className="mt-1 text-sm text-slate-600">Update your account password.</p>
          </div>

          <form className="space-y-6" onSubmit={handleChangePassword}>
            <div className="grid grid-cols-1 gap-5">
              <label className="block text-sm font-semibold text-slate-900">
                New Password
                <input
                  className={inputClass}
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="New password"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-900">
                Confirm New Password
                <input
                  className={inputClass}
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                onClick={() => {
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                Clear
              </button>
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={changingPassword}
              >
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
