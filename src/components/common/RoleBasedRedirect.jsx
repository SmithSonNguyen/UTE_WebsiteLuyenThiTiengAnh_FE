import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import getTokenRole from "@/utils/getTokenRole";

const RoleBasedRedirect = () => {
  const token = useSelector((state) => state.auth.login.accessToken);

  if (!token) {
    // Không có token → redirect về trang chủ
    return <Navigate to="/toeic-home" replace />;
  }

  const role = getTokenRole(token);

  if (role === "instructor") {
    return <Navigate to="/instructor" replace />;
  } else {
    return <Navigate to="/toeic-home" replace />;
  }
};

export default RoleBasedRedirect;
