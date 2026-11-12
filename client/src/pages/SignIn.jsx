import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function SignIn() {
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address';
    if (!form.password) err.password = 'Password is required';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setStatus({ type: '', text: '' });
    try {
      const user = await signin(form.email, form.password);
      setStatus({ type: 'success', text: `Welcome back, ${user.name}!` });
      setTimeout(() => navigate(location.state?.from || '/projects'), 700);
    } catch (err) {
      setStatus({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  return (
    <section className="page narrow">
      <h1>Sign in</h1>
      {status.text && <p className={`alert ${status.type}`} role="status">{status.text}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <label>Email
          <input name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>Password
          <input name="password" type="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p>No account yet? <Link to="/signup">Sign up</Link></p>
    </section>
  );
}
