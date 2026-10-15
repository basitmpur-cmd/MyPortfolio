import { education } from '../data.js';

export default function Education() {
  return (
    <section className="page">
      <h1>Education</h1>
      <ul className="timeline">
        {education.map((e) => (
          <li key={e.credential}>
            <h2>{e.credential}</h2>
            <p>{e.school}</p>
            <p className="dates">{e.dates}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
