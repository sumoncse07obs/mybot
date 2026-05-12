import { Bot, Database, FileText } from 'lucide-react';

export default function CustomerDashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <span className="page-kicker">Customer only</span>
        <h1>Customer Dashboard</h1>
        <p>Only customer accounts can access this workspace.</p>
      </div>

      <div className="card-grid">
        <div className="stat-card">
          <FileText />
          <h3>Resources</h3>
          <p>Upload documents, URLs, and business knowledge for your RAG chatbot.</p>
        </div>

        <div className="stat-card">
          <Database />
          <h3>Knowledge Base</h3>
          <p>Future area for chunks, embeddings, and indexed customer content.</p>
        </div>

        <div className="stat-card">
          <Bot />
          <h3>Agents</h3>
          <p>Create and configure customer-specific chatbot agents.</p>
        </div>
      </div>
    </div>
  );
}
