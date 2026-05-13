import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  Bot,
  ChevronDown,
  FileText,
  Folder,
  Goal,
  HeartPulse,
  Settings,
  UserRound,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
}

const mentors = ['Jen', 'Dwayne', 'Oz', 'Ryan'];

export default function Sidebar({ isOpen }: Props) {
  return (
    <aside className={`guru-sidebar customer-guru-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="guru-sidebar-tools">
        <button type="button" aria-label="Back">‹</button>
        <button type="button" aria-label="Search">⌕</button>
      </div>

      <div className="mentor-grid">
        {mentors.map((mentor, index) => (
          <div className="mentor-pill" key={mentor}>
            <div className={`mentor-face face-${index + 1}`}>{mentor.charAt(0)}</div>
            <span>{mentor}</span>
          </div>
        ))}
      </div>

      <div className="myguruuz-mark">
        <span>💡</span>
        <strong>My Guruuz</strong>
      </div>

      <div className="guru-sidebar-section-title">Mission Control</div>

      <div className="guru-folder-list">
        <NavLink to="/customer/dashboard" className="guru-folder-item">
          <ChevronDown size={14} />
          <Folder size={16} />
          <span>My Big Business</span>
        </NavLink>
        <NavLink to="/customer/dashboard" className="guru-folder-item">
          <Folder size={16} />
          <span>Work / Life Balance</span>
        </NavLink>
        <NavLink to="/customer/dashboard" className="guru-folder-item">
          <HeartPulse size={16} />
          <span>Health & Fitness</span>
        </NavLink>
        <NavLink to="/customer/dashboard" className="guru-folder-item active-blue">
          <BookOpen size={16} />
          <span>Journal</span>
        </NavLink>
        <NavLink to="/customer/profile" className="guru-folder-item">
          <UserRound size={16} />
          <span>Profile</span>
        </NavLink>
        <NavLink to="/customer/dashboard" className="guru-folder-item">
          <Bot size={16} />
          <span>Agent Settings</span>
        </NavLink>
      </div>

      <div className="guru-sidebar-card">
        <Goal size={36} />
        <div>
          <strong>Progress</strong>
          <span>On Your Goals</span>
        </div>
      </div>

      <div className="guru-sidebar-card active-card">
        <FileText size={36} />
        <div>
          <strong>Journal</strong>
          <span>Access Your Journal</span>
        </div>
      </div>

      <div className="guru-sidebar-card">
        <Settings size={34} />
        <div>
          <strong>Settings</strong>
          <span>Your Profile</span>
        </div>
      </div>
    </aside>
  );
}
