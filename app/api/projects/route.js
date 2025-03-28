import getDbConnection from '../../../lib/db';

export async function GET() {
  try {
    const connection = await getDbConnection();
    const [rows] = await connection.query('SELECT * FROM projects');
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database connection or query error:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching projects' }),
      { status: 500 }
    );
  }
}
