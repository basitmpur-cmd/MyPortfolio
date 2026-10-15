import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile } from '../data.js';

const empty = { firstName: '', lastName: '', phone: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const navigate = useNavigate();

  // Keep each input in component state as the visitor types.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Capture the values, then return the visitor to the Home page.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form values:', form);
    setForm(empty);
    navigate('/');
  };

  return (
    <section className="page contact">
      <div>
        <h1>Contact</h1>
        <p>Phone: <a href={`tel:${profile.phone}`}>{profile.phone}</a></p>
        <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        <p>Location: {profile.location}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>First name
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
        <label>Last name
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
        <label>Contact number
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
        </label>
        <label>Email address
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>Message
          <textarea name="message" rows="5" value={form.message} onChange={handleChange} required />
        </label>
        <button className="btn" type="submit">Send message</button>
      </form>
    </section>
  );
}
