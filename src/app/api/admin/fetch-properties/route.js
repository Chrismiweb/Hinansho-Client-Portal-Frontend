export async function GET(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const properties = globalThis.__properties || [];
  return new Response(JSON.stringify({ properties }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
