require('dotenv').config();
const { getTurso } = require('./db');
const bcrypt = require('bcryptjs');

async function initDatabase() {
  console.log('Initializing database...');

  try {
    const turso = getTurso();
    
    // Create tours table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS tours (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        duration TEXT NOT NULL,
        dates TEXT NOT NULL,
        location TEXT NOT NULL,
        banner_image TEXT,
        image_urls TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tours table created');

    // Create announcements table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        is_active INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Announcements table created');

    // Create admins table
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Admins table created');

    // Create default admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@goholiday.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Check if admin already exists
    const existingAdmin = await turso.execute({
      sql: 'SELECT * FROM admins WHERE email = ?',
      args: [adminEmail]
    });

    if (existingAdmin.rows.length === 0) {
      await turso.execute({
        sql: 'INSERT INTO admins (email, password_hash) VALUES (?, ?)',
        args: [adminEmail, passwordHash]
      });
      console.log(`✓ Default admin created: ${adminEmail}`);
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
