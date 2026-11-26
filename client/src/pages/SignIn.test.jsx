import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import SignIn from './SignIn.jsx';
import { mockFetch, renderPage } from '../test/utils.jsx';

const projectsRoute = <Route path="/projects" element={<h1>Projects page</h1>} />;

describe('SignIn page', () => {
  it('shows validation errors and does not call the API when the form is invalid', async () => {
    const fetch = mockFetch({});
    renderPage(<SignIn />, { path: '/signin' });

    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('signs in, stores the token and redirects to the projects page', async () => {
    const fetch = mockFetch({
      'POST /api/auth/signin': (body) => body.password === 'secret123'
        ? { status: 200, body: { token: 'jwt-abc', user: { _id: '1', name: 'Basit', role: 'admin' } } }
        : { status: 401, body: { error: 'Email and password do not match' } },
    });
    renderPage(<SignIn />, { path: '/signin', extraRoutes: projectsRoute });

    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'secret123');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Welcome back, Basit!')).toBeInTheDocument();
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ email: 'admin@example.com', password: 'secret123' });
    expect(localStorage.getItem('portfolio_token')).toBe('jwt-abc');
    expect(await screen.findByRole('heading', { name: 'Projects page' }, { timeout: 2000 })).toBeInTheDocument();
  });

  it('shows the server error message when the credentials are wrong', async () => {
    mockFetch({ 'POST /api/auth/signin': { status: 401, body: { error: 'Email and password do not match' } } });
    renderPage(<SignIn />, { path: '/signin' });

    await userEvent.type(screen.getByLabelText('Email'), 'admin@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Email and password do not match');
    await waitFor(() => expect(localStorage.getItem('portfolio_token')).toBeNull());
  });
});
