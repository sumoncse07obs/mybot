import { FormEvent, useEffect, useState } from 'react';
import { getAuthUser } from '@/api/auth/auth';
import type { AuthUser } from '@/types';
import { changeProfilePassword, getProfile, updateProfile } from '@/components/admin/module/profile/api/userapi';

type ProfileForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

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
        <div className="admin-panel">
          <div className="admin-empty">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-kicker">Profile</span>
        <h1>Edit Profile</h1>
        <p>{user?.email || 'No user loaded'}</p>
      </div>

      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      <div className="admin-panel profile-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Personal Information</h2>
            <p>Update your name and phone number.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSaveProfile}>
          <div className="form-grid two-cols">
            <label>
              First Name
              <input
                value={form.first_name}
                onChange={(event) => setForm({ ...form, first_name: event.target.value })}
                placeholder="First name"
              />
            </label>

            <label>
              Last Name
              <input
                value={form.last_name}
                onChange={(event) => setForm({ ...form, last_name: event.target.value })}
                placeholder="Last name"
              />
            </label>

            <label>
              Email
              <input value={form.email} disabled />
            </label>

            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="Phone number"
              />
            </label>
          </div>

          <div className="modal-actions profile-actions">
            <button type="button" className="admin-btn" onClick={() => syncForm(user)}>
              Reset
            </button>
            <button type="submit" className="admin-btn admin-btn-dark" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel profile-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Change Password</h2>
            <p>Update your account password.</p>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleChangePassword}>
          <div className="form-grid two-cols">
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password"
              />
            </label>

            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm new password"
              />
            </label>
          </div>

          <div className="modal-actions profile-actions">
            <button
              type="button"
              className="admin-btn"
              onClick={() => {
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Clear
            </button>
            <button type="submit" className="admin-btn admin-btn-dark" disabled={changingPassword}>
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}