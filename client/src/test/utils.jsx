import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from '../auth/AuthContext.jsx';

// Builds a fake fetch: `routes` maps "METHOD /api/path" to { status, body } or a function returning one.
export function mockFetch(routes) {
  const fn = vi.fn(async (url, opts = {}) => {
    const key = `${opts.method || 'GET'} ${url}`;
    let r = routes[key];
    if (typeof r === 'function') r = r(JSON.parse(opts.body || '{}'), opts);
    if (!r) r = { status: 404, body: { error: `No mock for ${key}` } };
    return { ok: r.status < 400, status: r.status, json: async () => r.body };
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

// Pretend a user is already signed in (what AuthContext keeps in localStorage).
export function signInAs(user) {
  localStorage.setItem('portfolio_token', 'test-token');
  localStorage.setItem('portfolio_user', JSON.stringify(user));
}

// Renders a page inside the router and auth provider, like main.jsx does.
export function renderPage(ui, { path = '/', extraRoutes = null } = {}) {
  return render(
    <MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path={path} element={ui} />
          {extraRoutes}
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}
