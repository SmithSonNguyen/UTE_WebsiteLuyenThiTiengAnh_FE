import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/profile/Profile";
import Home from "../pages/Home";
import EditProfile from "../pages/profile/EditProfile";
import ToeicHome from "../pages/ToeicHome";
import FreeEntryTest from "../pages/test/FreeEntryTest";
import TestOnline from "@/pages/test/TestOnline";
import DisplayFullTest from "@/components/test/DisplayFullTest";
import DisplayResultTest from "@/components/test/DisplayResultTest";
import ToeicLayout from "../components/layouts/ToeicLayout";
import VocabularyPage from "@/pages/VocabularyPage";
import FreeEntryTest_FullTest from "../pages/test/FreeEntryTest_FullTest";
import LichKhaiGiang from "../pages/course/LichKhaiGiang";
import CourseDetailPage from "@/pages/course/CourseDetailPage";
import MySchedulePage from "@/pages/course/MySchedulePage";
import ClassDetailPage from "@/pages/course/ClassDetailPage";

import ProtectedRouter from "./ProtectedRouter";

function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterWithOTP />} />
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
        element={<FreeEntryTest_FullTest />}
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
      {/* Vocabulary main page */}
      <Route
        path="/toeic-home/vocabulary"
        element={
          <ToeicLayout>
            <VocabularyPage />
          </ToeicLayout>
        }
      />
      <Route
        path="/toeic-home/test-online/:examId"
        element={
          <ToeicLayout>
            <DisplayFullTest />
          </ToeicLayout>
        }
      />
      <Route
        path="/toeic-home/test-online/:examId/result"
        element={
          <ToeicLayout>
            <DisplayResultTest />
          </ToeicLayout>
        }
      />

      {/* Lịch Khai giảng */}
      <Route path="/toeic-home/lich-khai-giang" element={<LichKhaiGiang />} />

      {/* Course Detail Page */}
      <Route
        path="/toeic-home/course/:id"
        element={
          <ToeicLayout showFooter={true}>
            <CourseDetailPage />
          </ToeicLayout>
        }
      />

      <Route element={<ProtectedRouter />}>
        <Route
          path="/profile"
          element={
            <ToeicLayout showFooter={true}>
              <Profile />
            </ToeicLayout>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <ToeicLayout>
              <EditProfile />
            </ToeicLayout>
          }
        />
        <Route
          path="/my-schedule"
          element={
            <ToeicLayout>
              <MySchedulePage />
            </ToeicLayout>
          }
        />
        <Route
          path="/classes/:classId"
          element={
            <ToeicLayout>
              <ClassDetailPage />
            </ToeicLayout>
          }
        />
      </Route>

      {/* Route mặc định, có thể redirect về login hoặc trang chủ */}
      <Route path="/" element={<Navigate to="/toeic-home" replace />} />
      <Route path="/example" element={<MySchedulePage />} />
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
