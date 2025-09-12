// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { setAccessToken, logoutSuccess } from "@/redux/authSlice";
import isTokenValid from "@/utils/isTokenValid";

import FullScreenLoader from "@/components/common/FullScreenLoader";

function ProtectedRouter() {
  const dispatch = useDispatch();
  const reduxToken = useSelector((state) => state.auth.login.accessToken);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (reduxToken && isTokenValid(reduxToken)) {
        // Token còn hạn
        setIsAuthenticated(true);
        setIsLoading(false);
      } else {
        // Token hết hạn → thử refresh
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/users/refresh-token`,
            {},
            { withCredentials: true }
          );
          dispatch(setAccessToken(res.data.access_token));
          setIsAuthenticated(true);
        } catch {
          dispatch(logoutSuccess());
          setIsAuthenticated(false);
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

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;

  //return reduxToken && isTokenValid(reduxToken) ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRouter;
