import { jwtDecode } from "jwt-decode";

export function getRoleBasedOnToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    throw new Error("Invalid token format");
  }
}
