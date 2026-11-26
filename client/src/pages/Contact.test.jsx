import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Contact from './Contact.jsx';
import { mockFetch, renderPage } from '../test/utils.jsx';

describe('Contact form', () => {
  it('saves a valid message through POST /api/contacts and clears the form', async () => {
    const fetch = mockFetch({ 'POST /api/contacts': (body) => ({ status: 201, body: { _id: 'c1', ...body } }) });
    renderPage(<Contact />, { path: '/contact' });

    await userEvent.type(screen.getByLabelText('First name'), 'Sara');
    await userEvent.type(screen.getByLabelText('Last name'), 'Ahmadi');
    await userEvent.type(screen.getByLabelText('Email address'), 'sara@example.com');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello!');
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(await screen.findByText('Thank you! Your message was saved.')).toBeInTheDocument();
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({ firstName: 'Sara', email: 'sara@example.com' });
    expect(screen.getByLabelText('First name')).toHaveValue('');
  });

  it('rejects an invalid phone number and email without sending', async () => {
    const fetch = mockFetch({});
    renderPage(<Contact />, { path: '/contact' });

    await userEvent.type(screen.getByLabelText('Contact number'), 'abc');
    await userEvent.type(screen.getByLabelText('Email address'), 'sara@');
    await userEvent.click(screen.getByRole('button', { name: 'Send message' }));

    expect(screen.getByText('Enter a valid phone number')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
