const User = require('../models/User');

exports.seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'FYC Admin',
        email: process.env.ADMIN_EMAIL || 'admin@fycjakma.com',
        password: process.env.ADMIN_PASSWORD || 'FYC@Admin2057!',
        role: 'admin'
      });
      console.log('✅ Admin user seeded');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
