import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="simple-page">
      <div className="simple-card">
        <h1>404</h1>
        <p>This page does not exist.</p>
        <Link to="/login">Back to login</Link>
      </div>
    </div>
  );
}
