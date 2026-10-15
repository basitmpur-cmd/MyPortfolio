import { services } from '../data.js';

export default function Services() {
  return (
    <section className="page">
      <h1>Services</h1>
      <div className="grid">
        {services.map((s) => (
          <article className="card" key={s.title}>
            <img src={s.image} alt={`${s.title} illustration`} />
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
