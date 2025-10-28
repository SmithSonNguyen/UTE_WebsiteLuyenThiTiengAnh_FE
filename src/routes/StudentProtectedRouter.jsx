import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken, logoutSuccess } from "@/redux/authSlice";
import isTokenValid from "@/utils/isTokenValid";
import getTokenRole from "@/utils/getTokenRole";
import FullScreenLoader from "@/components/common/FullScreenLoader";

function StudentProtectedRouter() {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.login.accessToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (reduxToken && isTokenValid(reduxToken)) {
        // Token còn hạn, kiểm tra role
        const role = getTokenRole(reduxToken);
        if (role === "guest" || !role) {
          // Coi user không có role là student
          setIsAuthenticated(true);
          setIsStudent(true);
        } else {
          setIsAuthenticated(true);
          setIsStudent(false);
        }
        setIsLoading(false);
      } else {
        // Token hết hạn → thử refresh
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`,
            {},
            { withCredentials: true }
          );
          const newToken = res.data.access_token;
          dispatch(setAccessToken(newToken));

          // Kiểm tra role với token mới
          const role = getTokenRole(newToken);
          if (role === "guest" || !role) {
            setIsAuthenticated(true);
            setIsStudent(true);
          } else {
            setIsAuthenticated(true);
            setIsStudent(false);
          }
        } catch {
          dispatch(logoutSuccess());
          setIsAuthenticated(false);
          setIsStudent(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    verifyToken();
  }, [reduxToken, dispatch]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  // Nếu không đăng nhập → redirect login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đăng nhập nhưng không phải student → redirect về instructor dashboard
  if (!isStudent) {
    return <Navigate to="/instructor" replace />;
  }

  // Nếu là student → cho phép truy cập
  return <Outlet />;
}

export default StudentProtectedRouter;
