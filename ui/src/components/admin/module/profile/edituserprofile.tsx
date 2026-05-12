import { getAuthUser } from '../../../../api/auth/auth';

export default function EditUserProfile() {
  const user = getAuthUser();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-kicker">Profile</span>
        <h1>Edit Profile</h1>
        <p>{user?.email || 'No user loaded'}</p>
      </div>
    </div>
  );
}
