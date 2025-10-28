import { jwtDecode } from "jwt-decode";

function getTokenRole(token) {
  try {
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.role || null;
  } catch (e) {
    console.error("Không thể decode token:", e);
    return null;
  }
}

export default getTokenRole;
