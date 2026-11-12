import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

// Sends visitors who are not signed in to the sign-in page.
// With adminOnly, signed-in regular users see an "access denied" message instead.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  if (adminOnly && !isAdmin) {
    return (
      <section className="page">
        <h1>Access denied</h1>
        <p className="alert error">This page is for administrators only.</p>
      </section>
    );
  }
  return children;
}
