import { LogOut } from 'lucide-react';
import type { AuthUser } from '@/types';

interface Props {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Topbar({ user, onLogout }: Props) {
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Unknown user';

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Logged in as</p>
        <h2>{fullName}</h2>
      </div>

      <div className="topbar-actions">
        <span className={`role-pill role-${user?.role}`}>{user?.role}</span>
        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
