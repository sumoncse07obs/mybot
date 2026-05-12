import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UserRound, Users } from 'lucide-react';

const navItems = [
      { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Users', path: '/admin/users', icon: Users },
      { label: 'Profile', path: '/admin/profile', icon: UserRound },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">B</div>
        <div>
          <h1>Admin Panel</h1>
          <p>Platform control</p>
        </div>
      </div>

      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.path} className="nav-link">
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <span>BotAPI</span>
        <small>React + FastAPI</small>
      </div>
    </aside>
  );
}
