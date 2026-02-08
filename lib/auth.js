import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'goholiday_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return await getIronSession(cookieStore, sessionOptions);
}

export async function login(email, password) {
  const result = await turso.execute({
    sql: 'SELECT * FROM admins WHERE email = ?',
    args: [email]
  });

  if (result.rows.length === 0) {
    return { success: false, error: 'Invalid credentials' };
  }

  const admin = result.rows[0];
  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  const session = await getSession();
  session.userId = admin.id;
  session.email = admin.email;
  await session.save();

  return { success: true };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
}

export async function isAuthenticated() {
  const session = await getSession();
  return !!session.userId;
}
