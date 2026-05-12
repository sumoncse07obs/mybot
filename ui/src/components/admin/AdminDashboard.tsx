import { Bot, ShieldCheck, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-kicker">Admin only</span>
        <h1>Admin Dashboard</h1>
        <p>Only users with role admin can access this dashboard.</p>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <Users />
          <h3>User Management</h3>
          <p>Promote users to customers, deactivate accounts, and manage platform access.</p>
        </div>

        <div className="stat-card">
          <ShieldCheck />
          <h3>Security Control</h3>
          <p>Admin routes are guarded in the frontend by role-based route protection.</p>
        </div>

        <div className="stat-card">
          <Bot />
          <h3>Agent Setup</h3>
          <p>Future home for global agent templates, system prompts, and RAG resources.</p>
        </div>
      </div>
    </div>
  );
}
