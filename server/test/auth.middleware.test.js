// Backend unit tests for the JWT guards (node:test, no database needed). Run: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'unit-test-secret'
const { requireSignin, isAdmin } = await import('../middleware/auth.js')
const config = (await import('../../config/config.js')).default
config.jwtSecret = 'unit-test-secret'

// Minimal Express-like response that records status and body.
const fakeRes = () => ({ code: 200, body: null, status(c) { this.code = c; return this }, json(b) { this.body = b; return this } })
const run = (mw, req) => { const res = fakeRes(); let nextCalled = false; mw(req, res, () => { nextCalled = true }); return { res, nextCalled } }

test('requireSignin rejects a request without a token (401)', () => {
  const { res, nextCalled } = run(requireSignin, { headers: {} })
  assert.equal(res.code, 401)
  assert.equal(nextCalled, false)
})

test('requireSignin rejects a forged token (401)', () => {
  const forged = jwt.sign({ _id: '1', role: 'admin' }, 'wrong-secret')
  const { res, nextCalled } = run(requireSignin, { headers: { authorization: `Bearer ${forged}` } })
  assert.equal(res.code, 401)
  assert.equal(nextCalled, false)
})

test('requireSignin accepts a valid token and exposes its payload on req.auth', () => {
  const token = jwt.sign({ _id: '42', role: 'user' }, 'unit-test-secret')
  const req = { headers: { authorization: `Bearer ${token}` } }
  const { nextCalled } = run(requireSignin, req)
  assert.equal(nextCalled, true)
  assert.equal(req.auth._id, '42')
})

test('isAdmin blocks a regular user (403) and lets an admin through', () => {
  assert.equal(run(isAdmin, { auth: { role: 'user' } }).res.code, 403)
  assert.equal(run(isAdmin, { auth: { role: 'admin' } }).nextCalled, true)
})
