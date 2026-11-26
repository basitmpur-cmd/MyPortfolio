import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Projects from '../pages/Projects.jsx';
import { mockFetch, renderPage, signInAs } from '../test/utils.jsx';

const admin = { _id: 'a1', name: 'Admin', role: 'admin' };
const regular = { _id: 'u1', name: 'Visitor', role: 'user' };
const sample = [{ _id: 'p1', title: 'Study Planner', completion: '2025-04-01', description: 'React planner app' }];

describe('RecordManager on the Projects page', () => {
  it('gives regular users a read-only list without the form or edit/delete buttons', async () => {
    signInAs(regular);
    mockFetch({ 'GET /api/auth/me': { status: 200, body: { user: regular } }, 'GET /api/projects': { status: 200, body: sample } });
    renderPage(<Projects />, { path: '/projects' });

    expect(await screen.findByRole('heading', { name: 'Study Planner' })).toBeInTheDocument();
    expect(screen.getByText(/Read-only view/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Create' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument();
  });

  it('lets an administrator create a project: validates, sends the token, and reloads the list', async () => {
    signInAs(admin);
    let projects = [...sample];
    const fetch = mockFetch({
      'GET /api/auth/me': { status: 200, body: { user: admin } },
      'GET /api/projects': () => ({ status: 200, body: projects }),
      'POST /api/projects': (body) => { projects = [...projects, { _id: 'p2', ...body }]; return { status: 201, body: projects[1] }; },
    });
    renderPage(<Projects />, { path: '/projects' });
    await screen.findByRole('heading', { name: 'Study Planner' });

    // Empty submit: client-side validation blocks the request.
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(fetch.mock.calls.some(([, o]) => o?.method === 'POST')).toBe(false);

    await userEvent.type(screen.getByLabelText(/Title/), 'Weather App');
    await userEvent.type(screen.getByLabelText(/Completion date/), '2026-10-15');
    await userEvent.type(screen.getByLabelText(/Description/), 'Forecast dashboard');
    await userEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Project created.')).toBeInTheDocument();
    const post = fetch.mock.calls.find(([, o]) => o?.method === 'POST');
    expect(post[1].headers.Authorization).toBe('Bearer test-token');
    expect(JSON.parse(post[1].body)).toMatchObject({ title: 'Weather App', completion: '2026-10-15' });
    const card = (await screen.findByRole('heading', { name: 'Weather App' })).closest('article');
    expect(within(card).getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });
});
