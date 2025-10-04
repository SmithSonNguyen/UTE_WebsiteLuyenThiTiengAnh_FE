import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import EditProfile from "../pages/EditProfile";
import ToeicHome from "../pages/ToeicHome";
import FreeEntryTest from "../pages/FreeEntryTest";
import TestOnline from "@/pages/TestOnline";
import QuestionDisplay from "@/components/test/QuestionDisplay";
import ToeicLayout from "../components/layouts/ToeicLayout";

import ProtectedRouter from "./ProtectedRouter";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* TOEIC routes with shared layout */}
      <Route
        path="/toeic-home"
        element={
          <ToeicLayout showFooter={true}>
            <ToeicHome />
          </ToeicLayout>
        }
      />
      <Route
        path="/toeic-home/free-entry-test"
        // cái này để mà chỉ khi user đăng kí rồi mới được sử dụng, có thể bỏ cmt ở ProtectedRouter ra
        element={
          <ToeicLayout>
            {/* <ProtectedRouter> */}
            <FreeEntryTest />
            {/* </ProtectedRouter> */}
          </ToeicLayout>
        }
      />
      <Route
        path="/toeic-home/free-entry-test/full-test"
        // element={<ToeicLayout><FreeEntryTest_FullTest /></ToeicLayout>}
      />
      <Route
        path="/toeic-home/free-entry-test/quick-test-LR"
        // element={<ToeicLayout><FreeEntryTest_QuickTest_LR /></ToeicLayout>}
      />
      <Route
        path="/toeic-home/free-entry-test/quick-test-4KN"
        // element={<ToeicLayout><FreeEntryTest_QuickTest_4KN /></ToeicLayout>}
      />
      <Route
        path="/toeic-home/test-online"
        element={
          <ToeicLayout>
            <TestOnline />
          </ToeicLayout>
        }
      />
      <Route
        path="/toeic-home/test-online/:examId"
        element={
          <ToeicLayout>
            <QuestionDisplay />
          </ToeicLayout>
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
