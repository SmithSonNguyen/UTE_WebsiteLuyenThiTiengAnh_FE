import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import getTokenRole from "@/utils/getTokenRole";
import isTokenValid from "@/utils/isTokenValid";

const RoleBasedRedirect = () => {
  const token = useSelector((state) => state.auth.login.accessToken);

  // Không có token hoặc token hết hạn → redirect về trang chủ
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/toeic-home" replace />;
  }

  // Lấy role từ token
  const role = getTokenRole(token);

  // Redirect dựa trên role
  switch (role) {
    case "admin":
      return <Navigate to="/admin" replace />;

    case "instructor":
      return <Navigate to="/instructor" replace />;

    case "guest":
    default:
      return <Navigate to="/toeic-home" replace />;
  }
};

export default RoleBasedRedirect;
