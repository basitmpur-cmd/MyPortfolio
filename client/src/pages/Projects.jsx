import { projects } from '../data.js';

export default function Projects() {
  return (
    <section className="page">
      <h1>Projects</h1>
      <div className="grid">
        {projects.map((p) => (
          <article className="card" key={p.title}>
            <img src={p.image} alt={`Screenshot of ${p.title}`} />
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p><strong>My role:</strong> {p.role}</p>
            <p><strong>Outcome:</strong> {p.outcome}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
