import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import EditProfile from "../pages/EditProfile";
import ToeicHome from "../pages/ToeicHome";
import FreeEntryTest from "../pages/FreeEntryTest";

import ProtectedRouter from "./ProtectedRouter";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* TOEIC routes */}
      <Route path="/toeic-home" element={<ToeicHome />} />
      <Route
        path="/toeic-home/free-entry-test"
        // cái này để mà chỉ khi user đăng kí rồi mới được sử dụng, có thể bỏ cmt ở ProtectedRouter ra
        element={
          // <ProtectedRouter>
          <FreeEntryTest />
          // </ProtectedRouter>
        }
      />

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
