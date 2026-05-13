import { NavLink } from 'react-router-dom';
import {
  Activity,
  BookOpen,
  ChevronDown,
  Clock,
  Folder,
  Headphones,
  Lock,
  Settings,
  Users,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
}

const adminItems = [
  { label: 'Breaks Server Uptime', path: '/admin/dashboard', icon: Settings },
  { label: 'Users Tokens Usage', path: '/admin/users', icon: Activity },
  { label: 'What are they using (Journal, Goal, TBD)', path: '/admin/dashboard', icon: BookOpen },
  { label: 'Which Guruu is Getting Most Use', path: '/admin/users', icon: Users },
];

export default function Sidebar({ isOpen }: Props) {
  return (
    <aside className={`guru-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="guru-sidebar-tools">
        <button type="button" aria-label="Back">‹</button>
        <button type="button" aria-label="Search">⌕</button>
      </div>

      <nav className="guru-sidebar-nav">
        {adminItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.path} className="guru-nav-link">
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="guru-nav-group">
          <button type="button">
            <Lock size={18} />
            <span>Security</span>
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="guru-nav-group">
          <button type="button">
            <Headphones size={18} />
            <span>Support</span>
            <ChevronDown size={15} />
          </button>
        </div>

        <div className="guru-nav-group">
          <button type="button">
            <Settings size={18} />
            <span>Settings</span>
            <ChevronDown size={15} />
          </button>
        </div>
      </nav>

      <div className="guru-sidebar-section-title">Mission Control</div>
      <div className="guru-folder-list">
        <NavLink to="/admin/dashboard" className="guru-folder-item">
          <ChevronDown size={14} />
          <Folder size={16} />
          <span>Admin Dashboard</span>
        </NavLink>
        <NavLink to="/admin/users" className="guru-folder-item">
          <Folder size={16} />
          <span>Users</span>
        </NavLink>
        <NavLink to="/admin/profile" className="guru-folder-item">
          <Folder size={16} />
          <span>Profile</span>
        </NavLink>
      </div>

      <div className="guru-sidebar-card compact">
        <Clock size={30} />
        <div>
          <strong>System</strong>
          <span>Monitor Platform</span>
        </div>
      </div>
    </aside>
  );
}
