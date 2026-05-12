import { MessageCircle, Sparkles, UserRound } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-kicker">User only</span>
        <h1>User Dashboard</h1>
        <p>Only normal user accounts can access this dashboard.</p>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <MessageCircle />
          <h3>Chat</h3>
          <p>Future area where users interact with the agent or RAG chatbot.</p>
        </div>

        <div className="stat-card">
          <UserRound />
          <h3>Profile</h3>
          <p>Manage user profile details and basic account information.</p>
        </div>

        <div className="stat-card">
          <Sparkles />
          <h3>AI Experience</h3>
          <p>Personalized AI responses and memory can be added here later.</p>
        </div>
      </div>
    </div>
  );
}
