export const apiRequest = async (endpoint, method, body) => {
  // Endpoint = /login.. Method = POST.. body = email, password...
  const response = await fetch(`http://localhost:3000/api/auth${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return response.json();
};
