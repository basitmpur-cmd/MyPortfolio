import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'],
  ['/education', 'Education'], ['/services', 'Services'], ['/contact', 'Contact'],
];

// Navigation bar with the original logo on the left and the sign-in state on the right.
export default function NavBar() {
  const { user, isAdmin, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => { await signout(); navigate('/signin'); };

  return (
    <header className="nav">
      <Link to="/" className="brand" aria-label="Home">
        <img src="/logo.svg" alt="AM monogram logo" width="44" height="44" />
        <span>Abdulbasit M.</span>
      </Link>
      <nav aria-label="Main">
        {links.map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
        ))}
        {user && <NavLink to="/messages">Messages</NavLink>}
        {!user && <NavLink to="/signin">Sign in</NavLink>}
        {!user && <NavLink to="/signup">Sign up</NavLink>}
        {user && (
          <span className="who">
            {user.name} ({isAdmin ? 'admin' : 'user'})
            <button type="button" className="link-btn" onClick={handleSignout}>Sign out</button>
          </span>
        )}
      </nav>
    </header>
  );
}
