import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken, logoutSuccess } from "@/redux/authSlice";
import isTokenValid from "@/utils/isTokenValid";
import getTokenRole from "@/utils/getTokenRole";
import FullScreenLoader from "@/components/common/FullScreenLoader";

function AdminProtectedRouter() {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.login.accessToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (reduxToken && isTokenValid(reduxToken)) {
        // Token còn hạn, kiểm tra role
        const role = getTokenRole(reduxToken);
        if (role === "admin") {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(true);
          setIsAdmin(false);
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
          if (role === "admin") {
            setIsAuthenticated(true);
            setIsAdmin(true);
          } else {
            setIsAuthenticated(true);
            setIsAdmin(false);
          }
        } catch {
          dispatch(logoutSuccess());
          setIsAuthenticated(false);
          setIsAdmin(false);
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

  // Nếu đăng nhập nhưng không phải admin → redirect về trang tương ứng với role
  if (!isAdmin) {
    const role = getTokenRole(reduxToken);

    // Redirect theo role của user
    if (role === "instructor") {
      return <Navigate to="/instructor" replace />;
    } else {
      return <Navigate to="/toeic-home" replace />;
    }
  }

  // Nếu là admin → cho phép truy cập
  return <Outlet />;
}

export default AdminProtectedRouter;
