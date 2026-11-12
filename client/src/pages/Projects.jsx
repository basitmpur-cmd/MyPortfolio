import RecordManager from '../components/RecordManager.jsx';

const fields = [
  { name: 'title', label: 'Title', required: true },
  { name: 'completion', label: 'Completion date', type: 'date', required: true },
  { name: 'description', label: 'Description', type: 'textarea', required: true },
];

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-CA', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }) : '');

// Projects are loaded from MongoDB through GET /api/projects.
export default function Projects() {
  return (
    <section className="page">
      <h1>Projects</h1>
      <RecordManager
        resource="projects"
        label="Project"
        fields={fields}
        renderItem={(p, i) => (
          <>
            <img src={`/images/project${(i % 3) + 1}.svg`} alt={`Illustration for ${p.title}`} />
            <h2>{p.title}</h2>
            <p>{p.description}</p>
            <p className="dates">Completed: {formatDate(p.completion)}</p>
          </>
        )}
      />
    </section>
  );
}
