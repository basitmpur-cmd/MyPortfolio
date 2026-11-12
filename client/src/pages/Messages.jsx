import RecordManager from '../components/RecordManager.jsx';

const fields = [
  { name: 'firstName', label: 'First name', required: true },
  { name: 'lastName', label: 'Last name', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone' },
  { name: 'message', label: 'Message', type: 'textarea', required: true },
];

// Contact submissions (GET /api/contacts needs a signed-in user; edit/delete need an admin).
export default function Messages() {
  return (
    <section className="page">
      <h1>Contact messages</h1>
      <RecordManager
        resource="contacts"
        label="Contact"
        fields={fields}
        allowCreate={false}
        renderItem={(c) => (
          <>
            <h2>{c.firstName} {c.lastName}</h2>
            <p><a href={`mailto:${c.email}`}>{c.email}</a>{c.phone && ` · ${c.phone}`}</p>
            <p>{c.message}</p>
            <p className="dates">{new Date(c.createdAt).toLocaleString()}</p>
          </>
        )}
      />
    </section>
  );
}
