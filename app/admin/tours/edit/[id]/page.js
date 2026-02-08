import { redirect } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { createClient } from '@libsql/client'
import EditTourForm from './EditTourForm'

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function getTour(id) {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM tours WHERE id = ?',
      args: [id]
    });
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
}

export default async function EditTourPage({ params }) {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/admin');
  }

  const tour = await getTour(params.id);

  if (!tour) {
    redirect('/admin/dashboard');
  }

  return <EditTourForm tour={tour} />;
}
