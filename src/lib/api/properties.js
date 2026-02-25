export async function createProperty(payload = {}, token, baseUrl = '/api/admin/add-properties') {
  if (!token) throw new Error('Token is required');

  const form = new FormData();
  // payload expected keys: name, property_type, location, description, status, totalUnits, expected_roi, image
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) form.append(k, v);
  });

  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function fetchProperties(token, baseUrl = '/api/admin/fetch-properties') {
  if (!token) throw new Error('Token is required');

  const res = await fetch(baseUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function deleteProperty(id, token, baseUrlRoot = '/api/admin/delete-property') {
  if (!token) throw new Error('Token is required');
  if (!id) throw new Error('Property id is required');

  const res = await fetch(`${baseUrlRoot}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export async function updateProperty(id, payload = {}, token, baseUrl = '/api/admin/update-property') {
  if (!token) throw new Error('Token is required');
  if (!id) throw new Error('Property id is required');

  // This uses JSON by default; replace with FormData if your backend expects multipart
  const res = await fetch(`${baseUrl}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export default { createProperty, fetchProperties, deleteProperty, updateProperty };
