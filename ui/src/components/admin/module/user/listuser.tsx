import { useEffect, useState } from 'react';
import {
  AdminUser,
  changeAdminUserPassword,
  changeAdminUserRole,
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from './api/userapi';
import type { Role } from '../../../../types';

type CreateUserForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  is_active: boolean;
};

const emptyCreateForm: CreateUserForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  role: 'user',
  is_active: true,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>(emptyCreateForm);
  const [creating, setCreating] = useState(false);

  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');

  async function loadUsers() {
    try {
      setLoading(true);
      setError('');
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser() {
    try {
      if (!createForm.email.trim()) {
        alert('Email is required');
        return;
      }

      if (!createForm.password.trim()) {
        alert('Password is required');
        return;
      }

      setCreating(true);

      await createAdminUser({
        first_name: createForm.first_name || null,
        last_name: createForm.last_name || null,
        email: createForm.email,
        phone: createForm.phone || null,
        password: createForm.password,
        role: createForm.role,
        is_active: createForm.is_active,
      });

      setShowCreateModal(false);
      setCreateForm(emptyCreateForm);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setCreating(false);
    }
  }

  async function handleRoleChange(userId: number, role: Role) {
    await changeAdminUserRole(userId, role);
    await loadUsers();
  }

  async function handleToggleActive(user: AdminUser) {
    await updateAdminUser(user.id, {
      is_active: !user.is_active,
    });
    await loadUsers();
  }

  async function handleSaveEdit() {
    if (!editingUser) return;

    await updateAdminUser(editingUser.id, {
      first_name: editingUser.first_name || null,
      last_name: editingUser.last_name || null,
      phone: editingUser.phone || null,
      is_active: editingUser.is_active,
    });

    setEditingUser(null);
    await loadUsers();
  }

  async function handlePasswordChange() {
    if (!passwordUser || !newPassword.trim()) return;

    await changeAdminUserPassword(passwordUser.id, newPassword);

    setPasswordUser(null);
    setNewPassword('');
    alert('Password changed successfully');
  }

  async function handleDelete(user: AdminUser) {
    if (user.role === 'admin') {
      alert('Admin users cannot be deleted.');
      return;
    }

    if (!confirm(`Delete ${user.email}?`)) return;

    await deleteAdminUser(user.id);
    await loadUsers();
  }

  return (
    <div className="dashboard-page">
      <div className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Users</h2>
            <p>{users.length} total users</p>
          </div>

          <div className="table-actions">
            <button
              className="admin-btn admin-btn-dark"
              onClick={() => setShowCreateModal(true)}
            >
              + Add User
            </button>

            <button className="admin-btn admin-btn-dark" onClick={loadUsers}>
              Refresh
            </button>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loading ? (
          <div className="admin-empty">Loading users...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>
                        {user.first_name || ''} {user.last_name || ''}
                      </strong>
                      <small>ID: {user.id}</small>
                    </td>

                    <td>{user.email}</td>
                    <td>{user.phone || '-'}</td>

                    <td>
                      <select
                        className="admin-select"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as Role)
                        }
                      >
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                        <option value="user">User</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className={user.is_active ? 'status active' : 'status inactive'}
                        onClick={() => handleToggleActive(user)}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td>
                      <div className="table-actions">
                        <button className="admin-btn" onClick={() => setEditingUser(user)}>
                          Edit
                        </button>

                        <button className="admin-btn" onClick={() => setPasswordUser(user)}>
                          Password
                        </button>

                        <button className="admin-btn danger" onClick={() => handleDelete(user)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="admin-empty">No users found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Add User</h2>

            <label>
              First Name
              <input
                value={createForm.first_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, first_name: e.target.value })
                }
              />
            </label>

            <label>
              Last Name
              <input
                value={createForm.last_name}
                onChange={(e) =>
                  setCreateForm({ ...createForm, last_name: e.target.value })
                }
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm({ ...createForm, email: e.target.value })
                }
              />
            </label>

            <label>
              Phone
              <input
                value={createForm.phone}
                onChange={(e) =>
                  setCreateForm({ ...createForm, phone: e.target.value })
                }
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm({ ...createForm, password: e.target.value })
                }
              />
            </label>

            <label>
              Role
              <select
                className="admin-select"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm({ ...createForm, role: e.target.value as Role })
                }
              >
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="user">User</option>
              </select>
            </label>

            <label>
              Status
              <select
                className="admin-select"
                value={createForm.is_active ? 'active' : 'inactive'}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    is_active: e.target.value === 'active',
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <div className="modal-actions">
              <button
                className="admin-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm(emptyCreateForm);
                }}
              >
                Cancel
              </button>

              <button
                className="admin-btn admin-btn-dark"
                onClick={handleCreateUser}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Edit User</h2>

            <label>
              First Name
              <input
                value={editingUser.first_name || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, first_name: e.target.value })
                }
              />
            </label>

            <label>
              Last Name
              <input
                value={editingUser.last_name || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, last_name: e.target.value })
                }
              />
            </label>

            <label>
              Phone
              <input
                value={editingUser.phone || ''}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, phone: e.target.value })
                }
              />
            </label>

            <label>
              Status
              <select
                className="admin-select"
                value={editingUser.is_active ? 'active' : 'inactive'}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    is_active: e.target.value === 'active',
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <div className="modal-actions">
              <button className="admin-btn" onClick={() => setEditingUser(null)}>
                Cancel
              </button>

              <button className="admin-btn admin-btn-dark" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {passwordUser && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2>Change Password</h2>
            <p>{passwordUser.email}</p>

            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <div className="modal-actions">
              <button
                className="admin-btn"
                onClick={() => {
                  setPasswordUser(null);
                  setNewPassword('');
                }}
              >
                Cancel
              </button>
              <button className="admin-btn admin-btn-dark" onClick={handlePasswordChange}>
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}