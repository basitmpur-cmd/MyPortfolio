import { NavLink, Link } from 'react-router-dom';

const links = [
  ['/', 'Home'], ['/about', 'About'], ['/projects', 'Projects'],
  ['/education', 'Education'], ['/services', 'Services'], ['/contact', 'Contact'],
];

// Navigation bar with the original logo on the left.
export default function NavBar() {
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
      </nav>
    </header>
  );
}
