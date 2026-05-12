import { Outlet, useNavigate } from 'react-router-dom';
import { clearAuth, getAuthUser } from '../../../api/auth/auth';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function UserAppLayout() {
  const navigate = useNavigate();
  const user = getAuthUser();

  function handleLogout() {
    clearAuth();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar user={user} onLogout={handleLogout} />
        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
