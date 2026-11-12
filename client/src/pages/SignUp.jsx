import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const empty = { name: '', email: '', password: '', confirm: '' };

export default function SignUp() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    if (form.password.length < 6) err.password = 'Password must be at least 6 characters';
    if (form.confirm !== form.password) err.confirm = 'Passwords do not match';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const user = await signup(form.name, form.email, form.password);
      setStatus({ type: 'success', text: `Account created. You are signed in as ${user.name}.` });
      setForm(empty);
      setTimeout(() => navigate('/projects'), 900);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const field = (name, label, type = 'text') => (
    <label>{label}
      <input name={name} type={type} value={form[name]} onChange={handleChange} />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </label>
  );

  return (
    <section className="page narrow">
      <h1>Sign up</h1>
      {status.text && <p className={`alert ${status.type}`} role="status">{status.text}</p>}
      <form onSubmit={handleSubmit} noValidate>
        {field('name', 'Full name')}
        {field('email', 'Email', 'email')}
        {field('password', 'Password', 'password')}
        {field('confirm', 'Confirm password', 'password')}
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p>Already registered? <Link to="/signin">Sign in</Link></p>
    </section>
  );
}
