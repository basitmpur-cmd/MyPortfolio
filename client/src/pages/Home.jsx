import { Link } from 'react-router-dom';
import { profile } from '../data.js';

export default function Home() {
  return (
    <section className="hero">
      <h1>Hi, I am {profile.name}.</h1>
      <p className="lead">
        Welcome to my portfolio. I build clear, fast web applications with React, Node.js and MongoDB.
      </p>
      <p className="mission">My mission: write code that is simple to read and pleasant to use.</p>
      <Link className="btn" to="/about">Meet me on the About page</Link>
    </section>
  );
}
