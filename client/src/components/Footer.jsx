import { profile } from '../data.js';

export default function Footer() {
  return <footer className="footer">&copy; 2026 {profile.name}</footer>;
}
