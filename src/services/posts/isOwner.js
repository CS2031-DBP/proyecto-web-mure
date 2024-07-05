import { jwtDecode } from 'jwt-decode';

export function isPostOwner() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub;
  } catch (error) {
    throw new Error('Invalid token format');
  }
}
