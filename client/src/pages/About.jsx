import { profile } from '../data.js';

export default function About() {
  return (
    <section className="page about">
      <img className="avatar" src="/images/profile.svg" alt={`Profile portrait of ${profile.name}`} />
      <div>
        <h1>{profile.name}</h1>
        <h2>{profile.title}</h2>
        {profile.bio.map((p, i) => <p key={i}>{p}</p>)}
        <a className="btn" href="/resume.pdf" target="_blank" rel="noreferrer">Open my resume (PDF)</a>
      </div>
    </section>
  );
}
