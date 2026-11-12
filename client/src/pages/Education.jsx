import RecordManager from '../components/RecordManager.jsx';

const fields = [
  { name: 'title', label: 'Qualification', required: true },
  { name: 'completion', label: 'Completion date', type: 'date', required: true },
  { name: 'description', label: 'Description (institution, details)', type: 'textarea', required: true },
];

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-CA', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }) : '');

// Qualifications are loaded from MongoDB through GET /api/qualifications.
export default function Education() {
  return (
    <section className="page">
      <h1>Education and qualifications</h1>
      <RecordManager
        resource="qualifications"
        label="Qualification"
        fields={fields}
        renderItem={(q) => (
          <>
            <h2>{q.title}</h2>
            <p>{q.description}</p>
            <p className="dates">Completed: {formatDate(q.completion)}</p>
          </>
        )}
      />
    </section>
  );
}
