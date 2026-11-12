import User from './models/user.model.js'
import config from '../config/config.js'

// Creates the administrator account from ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env.
// The password is supplied already hashed (bcrypt), so no plain password exists in code or config.
export const seedAdmin = async () => {
  const { adminEmail, adminName, adminPasswordHash } = config
  if (!adminEmail || !adminPasswordHash) {
    console.warn('Admin not seeded: set ADMIN_EMAIL and ADMIN_PASSWORD_HASH in .env')
    return
  }
  if (!/^\$2[aby]\$\d{2}\$/.test(adminPasswordHash)) {
    console.warn('Admin not seeded: ADMIN_PASSWORD_HASH must be a bcrypt hash (npm run hash -- "password")')
    return
  }
  const existing = await User.findOne({ email: adminEmail })
  if (existing) {
    if (existing.role !== 'admin') { existing.role = 'admin'; await existing.save() }
    return
  }
  await User.create({ name: adminName, email: adminEmail, hashed_password: adminPasswordHash, role: 'admin' })
  console.log(`Seeded administrator account ${adminEmail}`)
}
