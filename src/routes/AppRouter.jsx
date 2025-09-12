import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import EditProfile from "@/pages/EditProfile";

import ProtectedRouter from "./ProtectedRouter";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<ProtectedRouter />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
      </Route>

      {/* Route mặc định, có thể redirect về login hoặc trang chủ */}
      <Route path="/" element={<Home />} />
      {/* Route cho trang không tìm thấy */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
