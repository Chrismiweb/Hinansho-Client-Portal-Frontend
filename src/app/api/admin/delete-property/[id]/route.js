export async function DELETE(request, { params }) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { id } = params || {};
  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  globalThis.__properties = globalThis.__properties || [];
  const idx = globalThis.__properties.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const [removed] = globalThis.__properties.splice(idx, 1);

  return new Response(JSON.stringify({ removed }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
