// Usage: npm run hash -- "YourAdminPassword"
// Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in .env.
import bcrypt from 'bcryptjs'

const plain = process.argv[2]
if (!plain) { console.error('Usage: npm run hash -- "YourAdminPassword"'); process.exit(1) }
console.log(bcrypt.hashSync(plain, 10))
