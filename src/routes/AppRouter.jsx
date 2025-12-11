import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Profile from "../pages/profile/Profile";
import EditProfile from "../pages/profile/EditProfile";
import ToeicHome from "../pages/ToeicHome";
import FreeEntryTest from "../pages/test/FreeEntryTest";
import TestOnline from "@/pages/test/TestOnline";
import DisplayFullTest from "@/components/test/DisplayFullTest";
import DisplayResultTest from "@/components/test/DisplayResultTest";
import ToeicLayout from "../components/layouts/ToeicLayout";
import VocabularyPage from "@/pages/VocabularyPage";
import MyVocabularyPage from "@/pages/MyVocabularyPage"; // ⭐ IMPORT MỚI
import FreeEntryTest_FullTest from "../pages/test/FreeEntryTest_FullTest";
import LichKhaiGiang from "../pages/course/LichKhaiGiang";
import CourseDetailPage from "@/pages/course/CourseDetailPage";
import MySchedulePage from "@/pages/course/MySchedulePage";
import ClassDetailPage from "@/pages/course/ClassDetailPage";
import RegisterWithOTP from "@/pages/auth/RegisterWithOTP";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";
import RoleBasedRedirect from "../components/common/RoleBasedRedirect";
import PaymentSuccess from "@/pages/payment/PaymentSuccess";
import PaymentFailed from "@/pages/payment/PaymentFailed";
import PaymentError from "@/pages/payment/PaymentError";
import Assurance from "@/pages/Assurance";
import ProtectedRouter from "./ProtectedRouter";
import InstructorProtectedRouter from "./InstructorProtectedRouter";
import StudentProtectedRouter from "./StudentProtectedRouter";
import FreeEntryTestResult from "@/pages/test/FreeEntryTestResult";
import VideoCoursePage from "@/pages/course/VideoCoursePage";
import PracticeTabs from "@/components/practice/PracticeTabs";
import NewsPortal from "@/pages/NewsPortal";
import AllCourse from "@/pages/course/AllCourse";
function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterWithOTP />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<StudentProtectedRouter />}>
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
        <Route path="/payment/error" element={<PaymentError />} />

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
          path="/toeic-home/free-entry-test/result"
          // cái này để mà chỉ khi user đăng kí rồi mới được sử dụng, có thể bỏ cmt ở ProtectedRouter ra
          element={
            <ToeicLayout>
              {/* <ProtectedRouter> */}
              <FreeEntryTestResult />
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
        {/* ⭐ MY VOCABULARY PAGE - THÊM MỚI */}
        <Route
          path="/toeic-home/my-vocabulary"
          element={
            <ToeicLayout>
              <MyVocabularyPage />
            </ToeicLayout>
          }
        />
        <Route
          path="/toeic-home/news-portal"
          element={
            <ToeicLayout>
              <NewsPortal />
            </ToeicLayout>
          }
        />
        <Route
          path="/toeic-home/test-online/:examId"
          element={
            <ToeicLayout>
              <PracticeTabs />
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
        <Route
          path="/toeic-home/assurance"
          element={
            <ToeicLayout>
              <Assurance />
            </ToeicLayout>
          }
        />

        {/* Lịch Khai giảng */}
        <Route
          path="/toeic-home/opening-schedule"
          element={
            <ToeicLayout showFooter={true}>
              <LichKhaiGiang />
            </ToeicLayout>
          }
        />

        {/* All Course Page */}
        <Route
          path="/toeic-home/all-course"
          element={
            <ToeicLayout showFooter={true}>
              <AllCourse />
            </ToeicLayout>
          }
        />

        {/* Course Detail Page */}
        <Route
          path="/toeic-home/course/:id"
          element={
            <ToeicLayout showFooter={true}>
              <CourseDetailPage />
            </ToeicLayout>
          }
        />
        <Route
          path="/toeic-home/video-course/"
          element={
            <ToeicLayout showFooter={true}>
              <VideoCoursePage />
            </ToeicLayout>
          }
        />
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

      {/* Instructor Dashboard - Protected by InstructorProtectedRouter */}
      <Route element={<InstructorProtectedRouter />}>
        <Route path="/instructor" element={<InstructorDashboard />} />
      </Route>

      {/* Route mặc định, redirect thông minh dựa trên role */}
      <Route path="/" element={<RoleBasedRedirect />} />
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
