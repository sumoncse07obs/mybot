import { LogOut } from 'lucide-react';
import type { AuthUser } from '@/types';

interface Props {
  user: AuthUser | null;
  onLogout: () => void;
}

export default function Topbar({ user, onLogout }: Props) {
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || 'Unknown user';

  return (
    <header className="flex min-h-20 flex-col gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-7">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Logged in as</p>
        <h2 className="mt-1 text-lg font-bold text-slate-950">{fullName}</h2>
      </div>

      <div className="flex items-center gap-3">
        <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-700">
          {user?.role}
        </span>
        <button
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-bold text-white hover:bg-slate-800"
          onClick={onLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
