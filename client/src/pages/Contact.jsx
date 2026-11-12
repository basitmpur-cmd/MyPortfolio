import { useState } from 'react';
import { profile } from '../data.js';
import { api } from '../api.js';

const empty = { firstName: '', lastName: '', phone: '', email: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [sending, setSending] = useState(false);

  // Keep each input in component state as the visitor types.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = 'First name is required';
    if (!form.lastName.trim()) err.lastName = 'Last name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    if (form.phone && !/^[\d\s()+-]{7,}$/.test(form.phone)) err.phone = 'Enter a valid phone number';
    if (!form.message.trim()) err.message = 'Message is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Save the message to MongoDB through POST /api/contacts.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!validate()) { setStatus({ type: 'error', text: 'Please fix the highlighted fields.' }); return; }
    setSending(true);
    try {
      await api('/contacts', { method: 'POST', body: form });
      setStatus({ type: 'success', text: 'Thank you! Your message was saved.' });
      setForm(empty);
    } catch (err) {
      setErrors(err.errors || {});
      setStatus({ type: 'error', text: err.message });
    } finally { setSending(false); }
  };

  const field = (name, label, type = 'text') => (
    <label>{label}
      <input name={name} type={type} value={form[name]} onChange={handleChange} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  return (
    <section className="page contact">
      <div>
        <h1>Contact</h1>
        <p>Phone: <a href={`tel:${profile.phone}`}>{profile.phone}</a></p>
        <p>Email: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
        <p>Location: {profile.location}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        {status.text && <p className={`alert ${status.type}`} role="status">{status.text}</p>}
        {field('firstName', 'First name')}
        {field('lastName', 'Last name')}
        {field('phone', 'Contact number', 'tel')}
        {field('email', 'Email address', 'email')}
        <label>Message
          <textarea name="message" rows="5" value={form.message} onChange={handleChange} />
          {errors.message && <span className="field-error">{errors.message}</span>}
        </label>
        <button className="btn" type="submit" disabled={sending}>{sending ? 'Sending...' : 'Send message'}</button>
      </form>
    </section>
  );
}
