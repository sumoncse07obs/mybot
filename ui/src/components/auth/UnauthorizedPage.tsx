import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="simple-page">
      <div className="simple-card">
        <h1>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}
