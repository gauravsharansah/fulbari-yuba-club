const User = require('../models/User');

exports.seedAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin@fycjakma.com').toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD || 'FYC@Admin2057!';
    const name = process.env.ADMIN_NAME || 'FYC Admin';

    console.log(`🔍 Checking admin: ${email}`);

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      // Always update password on startup to ensure it's correctly hashed
      // This fixes the issue where env var changes don't reflect
      existingAdmin.password = password;
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      await existingAdmin.save();
      console.log(`✅ Admin password refreshed: ${email}`);
    } else {
      await User.create({ name, email, password, role: 'admin', isActive: true });
      console.log(`✅ Admin seeded: ${email}`);
    }

    // Seed additional admins from env vars (ADMIN_2_EMAIL, etc.)
    for (let i = 2; i <= 5; i++) {
      const aEmail = process.env[`ADMIN_${i}_EMAIL`];
      const aPass = process.env[`ADMIN_${i}_PASSWORD`];
      const aName = process.env[`ADMIN_${i}_NAME`] || `FYC Admin ${i}`;
      if (aEmail && aPass) {
        const normalizedEmail = aEmail.toLowerCase().trim();
        const exists = await User.findOne({ email: normalizedEmail });
        if (exists) {
          exists.password = aPass;
          exists.role = 'admin';
          exists.isActive = true;
          await exists.save();
          console.log(`✅ Admin ${i} refreshed: ${normalizedEmail}`);
        } else {
          await User.create({ name: aName, email: normalizedEmail, password: aPass, role: 'admin', isActive: true });
          console.log(`✅ Admin ${i} seeded: ${normalizedEmail}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};
