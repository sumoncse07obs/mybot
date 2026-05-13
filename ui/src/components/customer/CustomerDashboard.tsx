export default function CustomerDashboard() {
  return (
    <div className="customer-workspace">
      <section className="customer-mentor-area">
        <div className="customer-hero-row">
          <div className="oz-avatar">Oz</div>
          <div>
            <div className="customer-logo-line">
              <span className="guru-logo-blue">My</span><span className="guru-logo-green">Guruu</span>
            </div>
            <h1>MY BIG BUSINESS &gt; Business Development</h1>
            <p>
              Goal Summary: <a href="#">Develop the World's Best AI Generated Mentorship Program</a>
              <span className="goal-icon">🌱</span>
            </p>
          </div>
        </div>

        <div className="mentor-message-card">
          <span className="mentor-small-icon">🌱</span>
          <div>
            <strong>Hey sumon sk,</strong>
            <p>Great leaders Speak to be Heard, Hear to be Moved and Move to make a Difference.</p>
          </div>
        </div>

        <div className="chat-card">
          <div className="chat-empty">Start the conversation with Oz.</div>
          <div className="chat-composer">
            <input placeholder="Type your message..." />
            <button type="button">Send</button>
          </div>
        </div>
      </section>

      <aside className="journal-panel">
        <div className="journal-header">
          <div>
            <span>▣</span>
            <strong><em>My</em>Journal</strong>
          </div>
          <button type="button">New Folder</button>
          <button type="button" className="primary">New Entry</button>
        </div>

        <div className="journal-filters">
          <input placeholder="Search entries..." />
          <button type="button">All Tags</button>
          <button type="button">Filters</button>
        </div>

        <div className="journal-card">
          <div className="journal-date">Mar 20, 2026</div>
          <h3>test Journal</h3>
          <p>test update</p>
          <span>test</span>
        </div>
      </aside>
    </div>
  );
}
