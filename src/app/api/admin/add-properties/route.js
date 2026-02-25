export async function POST(request) {
  const auth = request.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const formData = await request.formData();
  const name = formData.get('name')?.toString() || '';
  const property_type = formData.get('property_type')?.toString() || '';
  const location = formData.get('location')?.toString() || '';
  const description = formData.get('description')?.toString() || '';
  const status = formData.get('status')?.toString() || '';
  const totalUnits = formData.get('totalUnits')?.toString() || '';
  const expected_roi = formData.get('expected_roi')?.toString() || '';
  const image = formData.get('image');

  if (!name) {
    return new Response(JSON.stringify({ error: 'Missing property name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Simple in-memory store for demo/dev purposes
  globalThis.__properties = globalThis.__properties || [];

  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  let imageInfo = null;
  try {
    if (image && typeof image.arrayBuffer === 'function') {
      const buffer = await image.arrayBuffer();
      // Node's Buffer may be available in the runtime
      let b64 = '';
      try {
        b64 = Buffer.from(buffer).toString('base64');
      } catch (e) {
        // Fallback for runtimes without Buffer
        const arr = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i]);
        b64 = typeof btoa === 'function' ? btoa(binary) : '';
      }
      imageInfo = {
        name: image.name || null,
        type: image.type || null,
        size: image.size || null,
        data: b64 ? `data:${image.type};base64,${b64}` : null,
      };
    }
  } catch (err) {
    // ignore image conversion errors for now
    imageInfo = null;
  }

  const property = {
    id,
    name,
    property_type,
    location,
    description,
    status,
    totalUnits: totalUnits ? Number(totalUnits) : null,
    expected_roi: expected_roi ? Number(expected_roi) : null,
    image: imageInfo,
    createdAt: new Date().toISOString(),
  };

  globalThis.__properties.push(property);

  return new Response(JSON.stringify({ property }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}
