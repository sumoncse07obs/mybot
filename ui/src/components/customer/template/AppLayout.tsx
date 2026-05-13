import { Outlet, useNavigate } from 'react-router-dom';
import { clearAuth, getAuthUser } from '@/api/auth/auth';
import Sidebar from '@/components/customer/template/Sidebar';
import Topbar from '@/components/customer/template/Topbar';

export default function CustomerAppLayout() {
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
