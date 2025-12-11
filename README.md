# Website Luyện Thi Tiếng Anh TOEIC - Frontend

Hệ thống học tập và quản lý khóa học tiếng Anh TOEIC với đầy đủ tính năng cho học viên, giảng viên và admin.

## 📋 Tổng quan dự án

### Mô tả

Website học tiếng Anh TOEIC với giao diện hiện đại, responsive và nhiều tính năng:

- **👨‍🎓 Học viên**: Làm bài test TOEIC, học từ vựng với AI, đăng ký khóa học, theo dõi tiến độ, đọc tin tức
- **👨‍🏫 Giảng viên**: Quản lý lớp học, điểm danh, xem thống kê học viên, duyệt yêu cầu học bù
- **👑 Admin**: Dashboard tổng quan, quản lý giảng viên, lớp học, khóa học, người dùng
- **💳 Hệ thống**: Thanh toán VNPay, OTP verification, real-time updates

## 🚀 Quick Start

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình environment variables

Tạo file `.env`:

```env
# Backend API
VITE_API_BASE_URL=http://localhost:3001

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Chạy ứng dụng

```bash
npm run dev     # Development mode (Vite dev server)
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

## 🛠️ Công nghệ sử dụng

### Core Technologies

- **React 19.1.1** - UI Library
- **Vite** - Build tool & dev server
- **React Router DOM 7.9.5** - Routing
- **Redux Toolkit + Redux Persist** - State management

### UI & Styling

- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Headless UI components (40+ components)
- **Ant Design 5.27.4** - Additional UI components
- **Framer Motion 12.23.12** - Animations
- **Lucide React** - Icons
- **Shadcn/UI** - Pre-built accessible components

### Form & Validation

- **React Hook Form 7.62.0** - Form state management
- **Yup 1.7.0** - Schema validation
- **Input OTP 1.4.2** - OTP input component

### Data Visualization & Charts

- **Recharts 3.2.0** - Chart library
- **React Day Picker 9.11.0** - Date picker

### AI Integration

- **@google/generative-ai** - Google Gemini AI
- **@google/genai** - Alternative Gemini client

### HTTP & API

- **Axios 1.11.0** - HTTP client
- **JWT Decode 4.0.0** - JWT token decoding

### Utilities

- **Moment Timezone** - Date/time manipulation
- **React Hot Toast & React Toastify** - Notifications
- **Sonner** - Toast notifications
- **Class Variance Authority** - Conditional classnames
- **Tailwind Merge** - Merge Tailwind classes

## 🏗️ Cấu trúc dự án

```
src/
├── api/                          # API service layers
│   ├── adminApi.js               # Admin APIs
│   ├── attendanceApi.js          # Attendance APIs
│   ├── classApi.js               # Class management APIs
│   ├── courseApi.js              # Course APIs
│   ├── enrollmentApi.js          # Enrollment APIs
│   ├── instructorApi.js          # Instructor APIs
│   ├── makeuprequestApi.js       # Makeup request APIs
│   ├── otpApi.js                 # OTP verification APIs
│   ├── paymentApi.js             # Payment APIs
│   ├── questionApi.js            # Question APIs
│   ├── reviewApi.js              # Review APIs
│   ├── testApi.js                # Test APIs
│   └── userApi.js                # User APIs
│
├── components/                   # React components
│   ├── common/                   # Shared components
│   │   ├── AvatarMenu.jsx        # User avatar dropdown
│   │   ├── BottomNav.jsx         # Mobile bottom navigation
│   │   ├── Button.jsx            # Custom button component
│   │   ├── ConfirmModal.jsx      # Confirmation dialog
│   │   ├── Footer.jsx            # Footer component
│   │   ├── Header.jsx            # Header/Navbar
│   │   ├── Input.jsx             # Custom input component
│   │   ├── StartModal.jsx        # Test start modal
│   │   ├── ResultModal.jsx       # Test result modal
│   │   ├── VocabTranslator.jsx   # AI-powered translator
│   │   └── admin/                # Admin shared components
│   │
│   ├── course/                   # Course-related components
│   │   ├── CourseCard.jsx        # Course display card
│   │   ├── CourseCarousel.jsx    # Course carousel slider
│   │   ├── CourseDetail.jsx      # Course detail view
│   │   ├── FixedRegistrationCard.jsx # Sticky registration card
│   │   ├── MakeupModal.jsx       # Makeup request modal
│   │   └── ActionMenu.jsx        # Course action menu
│   │
│   ├── test/                     # Test/Exam components
│   │   ├── DisplayFullTest.jsx   # Full test display
│   │   ├── DisplayResultTest.jsx # Test result display
│   │   ├── QuestionCard.jsx      # Question display card
│   │   └── TestTimer.jsx         # Test countdown timer
│   │
│   ├── practice/                 # Practice section components
│   │   ├── PracticeTabs.jsx      # Practice tabs interface
│   │   ├── FullTestSection.jsx   # Full test practice
│   │   ├── DiscussionSection.jsx # Discussion forum
│   │   └── ...                   # Part-specific practice
│   │
│   ├── home/                     # Home page tabs
│   │   ├── HomeTab.jsx           # Home dashboard tab
│   │   ├── LearnTab.jsx          # Learning tab
│   │   ├── PracticeTab.jsx       # Practice tab
│   │   └── ProfileTab.jsx        # Profile tab
│   │
│   ├── instructor/               # Instructor components
│   │   ├── InstructorProfile.jsx # Instructor profile
│   │   ├── ClassesOverview.jsx   # Classes overview
│   │   └── AttendanceManagement.jsx # Attendance management
│   │
│   ├── layouts/                  # Layout components
│   │   ├── MainLayout.jsx        # Main app layout
│   │   ├── ToeicLayout.jsx       # TOEIC section layout
│   │   ├── AdminLayout.jsx       # Admin panel layout
│   │   └── HeaderToeicHome.jsx   # TOEIC header
│   │
│   ├── design/                   # Design-specific components
│   │   ├── vocabulary/           # Vocabulary UI
│   │   └── myvocabulary/         # My vocabulary UI
│   │
│   ├── gemini/                   # AI integration
│   │   └── geminikey.js          # Gemini API configuration
│   │
│   ├── profile/                  # Profile components
│   │   └── ProfileInfo.jsx       # Profile information
│   │
│   └── ui/                       # Shadcn UI components
│       ├── accordion.jsx
│       ├── alert-dialog.jsx
│       ├── avatar.jsx
│       ├── button.jsx
│       ├── card.jsx
│       ├── checkbox.jsx
│       ├── dialog.jsx
│       ├── dropdown-menu.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── select.jsx
│       ├── tabs.jsx
│       ├── toast.jsx
│       └── ...                   # 40+ UI components
│
├── pages/                        # Page components
│   ├── auth/                     # Authentication pages
│   │   ├── Login.jsx
│   │   ├── RegisterWithOTP.jsx
│   │   └── ForgotPassword.jsx
│   │
│   ├── test/                     # Test pages
│   │   ├── FreeEntryTest.jsx     # Free entry test
│   │   ├── FreeEntryTestResult.jsx # Entry test result
│   │   ├── TestOnline.jsx        # Online TOEIC test
│   │   └── FreeEntryTest_FullTest.jsx # Full test view
│   │
│   ├── course/                   # Course pages
│   │   ├── AllCourse.jsx         # All courses listing
│   │   ├── CourseDetailPage.jsx  # Course detail page
│   │   ├── LichKhaiGiang.jsx     # Course schedule
│   │   ├── MySchedulePage.jsx    # My class schedule
│   │   ├── ClassDetailPage.jsx   # Class detail
│   │   ├── VideoCoursePage.jsx   # Video course player
│   │   ├── EnrolledVideoCourse.jsx # Enrolled courses
│   │   └── FreeTrialVideoCourse.jsx # Free trial
│   │
│   ├── instructor/               # Instructor pages
│   │   └── InstructorDashboard.jsx # Instructor dashboard
│   │
│   ├── admin/                    # Admin pages
│   │   ├── DashboardContent.jsx  # Admin dashboard
│   │   ├── InstructorManagement.jsx # Manage instructors
│   │   ├── ClassManagement.jsx   # Manage classes
│   │   ├── PreRecordedCourseManagement.jsx # Manage courses
│   │   └── UserManagement.jsx    # Manage users
│   │
│   ├── profile/                  # Profile pages
│   │   ├── Profile.jsx           # View profile
│   │   └── EditProfile.jsx       # Edit profile
│   │
│   ├── payment/                  # Payment result pages
│   │   ├── PaymentSuccess.jsx
│   │   ├── PaymentFailed.jsx
│   │   └── PaymentError.jsx
│   │
│   ├── Home.jsx                  # Home page
│   ├── ToeicHome.jsx             # TOEIC home page
│   ├── VocabularyPage.jsx        # Vocabulary learning
│   ├── MyVocabularyPage.jsx      # Personal vocabulary
│   ├── NewsPortal.jsx            # News portal
│   └── Assurance.jsx             # Assurance page
│
├── redux/                        # Redux state management
│   ├── authSlice.js              # Authentication state
│   └── store.js                  # Redux store configuration
│
├── routes/                       # Routing configuration
│   ├── AppRouter.jsx             # Main router
│   ├── ProtectedRouter.jsx       # Auth protected routes
│   ├── AdminProtectedRouter.jsx  # Admin only routes
│   ├── InstructorProtectedRouter.jsx # Instructor routes
│   └── StudentProtectedRouter.jsx # Student routes
│
├── utils/                        # Utility functions
│   ├── axiosInstance.js          # Axios configuration
│   ├── formatDateToDDMMYY.js     # Date formatting
│   ├── getDayOfWeekVN.js         # Vietnamese day names
│   ├── getTokenRole.js           # Extract role from JWT
│   ├── isTokenValid.js           # JWT validation
│   └── score.js                  # Score calculation
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.jsx            # Mobile detection hook
│   └── use-toast.js              # Toast notification hook
│
├── lib/                          # Library utilities
│   └── utils.js                  # Shared utilities
│
├── assets/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── App.jsx                       # Root component
├── main.jsx                      # Entry point
└── index.css                     # Global styles
```

## 🔐 Authentication & Authorization

### Role-Based Access Control (RBAC)

- **Guest**: Không đăng nhập (xem khóa học, làm test miễn phí)
- **Registered**: Đã đăng ký, chưa mua khóa học
- **Paid**: Đã thanh toán khóa học
- **Free**: Nhận khóa học miễn phí
- **Instructor**: Giảng viên
- **Admin**: Quản trị viên

### Protected Routes

```jsx
// Route chỉ dành cho học viên đã đăng nhập
<Route element={<StudentProtectedRouter />}>
  <Route path="/my-schedule" element={<MySchedulePage />} />
</Route>

// Route chỉ dành cho giảng viên
<Route element={<InstructorProtectedRouter />}>
  <Route path="/instructor" element={<InstructorDashboard />} />
</Route>

// Route chỉ dành cho admin
<Route element={<AdminProtectedRouter />}>
  <Route path="/admin/*" element={<AdminLayout />} />
</Route>
```

### JWT Token Management

- Lưu trữ JWT trong Redux Persist
- Auto-refresh token khi hết hạn
- Tự động đăng xuất khi token invalid
- Role-based redirect sau login

## 🎯 Main Features

### ✨ Student Features

**Authentication**

- ✅ Đăng ký tài khoản với OTP email verification
- ✅ Đăng nhập / Đăng xuất
- ✅ Quên mật khẩu với OTP reset

**Learning & Testing**

- ✅ Làm bài test đầu vào miễn phí (Free Entry Test)
- ✅ Làm bài thi TOEIC online đầy đủ (Listening + Reading)
- ✅ Làm bài test theo từng phần (Part 1-7)
- ✅ Xem kết quả chi tiết với phân tích
- ✅ Timer đếm ngược thời gian làm bài
- ✅ Lưu progress tự động

**Vocabulary**

- ✅ Học từ vựng theo chủ đề
- ✅ Dịch từ vựng bằng Google Gemini AI
- ✅ Lưu từ vựng vào danh sách cá nhân
- ✅ Ôn tập từ vựng đã lưu

**Courses**

- ✅ Xem danh sách khóa học (Live-meet & Pre-recorded)
- ✅ Lọc khóa học theo cấp độ, giá, loại
- ✅ Xem chi tiết khóa học
- ✅ Đăng ký khóa học online
- ✅ Thanh toán qua VNPay
- ✅ Xem video bài giảng (Pre-recorded courses)
- ✅ Theo dõi tiến độ học tập

**Schedule & Classes**

- ✅ Xem lịch học cá nhân
- ✅ Xem lịch khai giảng các khóa học
- ✅ Chi tiết lớp học (giảng viên, học viên, buổi học)
- ✅ Yêu cầu học bù khi vắng mặt
- ✅ Xem lịch sử điểm danh

**News & Reading**

- ✅ Đọc tin tức tiếng Anh từ NewsAPI
- ✅ Lọc theo category và country
- ✅ Trích xuất nội dung bài báo

**Profile**

- ✅ Xem và chỉnh sửa thông tin cá nhân
- ✅ Upload avatar lên Cloudinary
- ✅ Xem lịch sử thanh toán
- ✅ Xem khóa học đã đăng ký

### 👨‍🏫 Instructor Features

**Dashboard**

- ✅ Xem tổng quan lớp học đang dạy
- ✅ Thống kê số học viên, buổi học
- ✅ Xem lịch giảng dạy

**Class Management**

- ✅ Xem danh sách lớp được phân công
- ✅ Xem chi tiết học viên trong lớp
- ✅ Xem thông tin buổi học (ngày, giờ, link Meet)

**Attendance**

- ✅ Điểm danh học viên theo buổi học
- ✅ Đánh dấu có mặt/vắng mặt
- ✅ Ghi chú cho từng học viên
- ✅ Hoàn thành điểm danh (finalize)
- ✅ Xem lịch sử điểm danh

**Makeup Requests**

- ✅ Xem danh sách yêu cầu học bù
- ✅ Duyệt/Từ chối yêu cầu học bù
- ✅ Thêm ghi chú khi xử lý

**Profile**

- ✅ Xem và cập nhật thông tin giảng viên
- ✅ Cập nhật chuyên môn, kinh nghiệm
- ✅ Upload chứng chỉ

### 👑 Admin Features

**Dashboard**

- ✅ Tổng quan hệ thống (doanh thu, học viên, khóa học)
- ✅ Biểu đồ doanh thu theo thời gian (Recharts)
- ✅ Top học viên xuất sắc
- ✅ Thống kê real-time

**Instructor Management**

- ✅ Xem danh sách giảng viên
- ✅ Tạo tài khoản giảng viên mới
- ✅ Xóa giảng viên
- ✅ Phân công lớp cho giảng viên
- ✅ Xem danh sách lớp chưa có giảng viên

**Class Management**

- ✅ Xem tất cả lớp học
- ✅ Tạo lớp học mới (tự động tạo mã lớp)
- ✅ Đổi giảng viên cho lớp
- ✅ Xóa lớp học
- ✅ Lọc lớp theo trạng thái, cấp độ

**Pre-Recorded Course Management**

- ✅ Xem danh sách khóa tự học
- ✅ Tạo khóa học mới
- ✅ Chỉnh sửa thông tin khóa học
- ✅ Upload video bài giảng
- ✅ Quản lý lessons và topics
- ✅ Xóa khóa học
- ✅ Đổi trạng thái (active/inactive/draft)

**User Management**

- ✅ Xem danh sách người dùng
- ✅ Xem chi tiết đăng ký của từng user
- ✅ Xóa người dùng
- ✅ Lọc theo role

## 🎨 UI/UX Features

### Responsive Design

- ✅ Desktop, Tablet, Mobile responsive
- ✅ Mobile bottom navigation
- ✅ Hamburger menu cho mobile
- ✅ Adaptive layouts

### Animations

- ✅ Framer Motion transitions
- ✅ Page transitions
- ✅ Smooth scrolling
- ✅ Hover effects
- ✅ Loading animations

### Accessibility

- ✅ Radix UI accessible components
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus management
- ✅ Screen reader support

### Dark Mode (Optional)

- Next Themes integration ready
- Can be enabled for entire app

### Notifications

- ✅ Toast notifications (React Hot Toast)
- ✅ Success/Error/Warning messages
- ✅ Custom styled toasts
- ✅ Position control

## 🔌 Third-Party Integrations

### Google Gemini AI

- Dịch từ vựng tiếng Anh - Việt
- Giải thích ý nghĩa từ
- Đưa ra ví dụ câu sử dụng
- Real-time translation

### VNPay Payment

- Thanh toán online cho khóa học
- Redirect payment flow
- Success/Failed handling
- Payment history tracking

### Cloudinary

- Upload avatar
- Upload course thumbnails
- Upload instructor certificates
- Image optimization
- CDN delivery

### NewsAPI

- Fetch English news articles
- Filter by category, country
- Search functionality
- Pagination support

## 📱 Route Structure

```jsx
/                              → RoleBasedRedirect (auto redirect theo role)
/login                         → Login page
/register                      → Register with OTP
/forgot-password               → Forgot password with OTP

// Student Routes (Protected)
/toeic-home                    → TOEIC Home page
/toeic-home/free-entry-test    → Free entry test
/toeic-home/test-online        → Online TOEIC tests
/toeic-home/test-online/:examId → Do specific exam
/toeic-home/vocabulary         → Learn vocabulary
/toeic-home/my-vocabulary      → My saved vocabulary
/toeic-home/news-portal        → English news portal
/toeic-home/opening-schedule   → Course opening schedule
/toeic-home/all-course         → All courses listing
/toeic-home/course/:id         → Course detail
/toeic-home/video-course       → Video courses
/my-schedule                   → My class schedule
/classes/:classId              → Class detail
/profile                       → User profile
/edit-profile                  → Edit profile
/payment/success               → Payment success
/payment/failed                → Payment failed

// Instructor Routes (Protected)
/instructor                    → Instructor dashboard

// Admin Routes (Protected)
/admin/dashboard               → Admin dashboard
/admin/teachers-management     → Manage instructors
/admin/classes-management      → Manage classes
/admin/courses-management      → Manage pre-recorded courses
/admin/users-management        → Manage users
```

## 🎨 Styling Architecture

### Tailwind CSS

- Utility-first approach
- Custom theme configuration
- Responsive breakpoints
- Dark mode support (optional)

### Component Library

- Shadcn/UI for base components
- Radix UI for accessibility
- Ant Design for complex components (Select, DatePicker)

### CSS Organization

```css
/* index.css structure */
@layer base {
  ...;
} // Base styles, resets
@layer components {
  ...;
} // Custom component classes
@layer utilities {
  ...;
} // Custom utilities
```

## 🧪 Development Tools

### Linting & Formatting

- ESLint for code quality
- Prettier-ready (can be added)
- Git hooks (can be added with Husky)

### Build Tools

- Vite for fast dev server
- Fast Hot Module Replacement (HMR)
- Optimized production builds
- Code splitting

### Performance Optimization

- React.lazy() for code splitting
- Image optimization with Cloudinary
- Memoization with useMemo, useCallback
- Virtual scrolling (can be added)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output sẽ có trong thư mục `dist/`

### Preview Production Build

```bash
npm run preview
```

### Deploy Options

- Vercel (recommended for Vite)
- Netlify
- GitHub Pages (config sẵn với gh-pages)
- AWS S3 + CloudFront
- Firebase Hosting

```bash
# Deploy to GitHub Pages
npm run deploy
```

## 📋 Environment Setup Checklist

- [ ] Create `.env` file
- [ ] Add `VITE_API_BASE_URL`
- [ ] Add `VITE_GEMINI_API_KEY`
- [ ] Add Cloudinary credentials
- [ ] Test backend connection
- [ ] Test payment integration (sandbox)
- [ ] Test OTP email sending

## 🎓 Learning Resources

### For Developers

- React 19 docs
- Vite documentation
- Tailwind CSS docs
- Radix UI documentation
- Redux Toolkit guide
- React Router v7 migration guide

## 📄 Documentation Files

- `README.md` - Main documentation (this file)
- `LICH_KHAI_GIANG_IMPLEMENTATION.md` - Schedule implementation guide

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 Code Style Guidelines

### Component Structure

```jsx
// 1. Imports
import React from "react";
import { useSelector } from "react-redux";

// 2. Component
function MyComponent() {
  // 3. Hooks
  const user = useSelector((state) => state.auth.user);

  // 4. Event handlers
  const handleClick = () => {};

  // 5. Render
  return <div>...</div>;
}

// 6. Export
export default MyComponent;
```

### Naming Conventions

- Components: PascalCase (`MyComponent.jsx`)
- Functions: camelCase (`handleSubmit`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- CSS classes: kebab-case (`my-class-name`)

## 🐛 Common Issues & Solutions

### CORS Error

- Kiểm tra `VITE_API_BASE_URL` trong `.env`
- Verify backend CORS configuration

### Token Expired

- Check token expiry in Redux DevTools
- Verify refresh token logic
- Clear localStorage and login again

### Image Upload Failed

- Verify Cloudinary credentials
- Check upload preset configuration
- Verify file size limits

### Payment Redirect Not Working

- Check VNPay return URL configuration
- Verify payment callback endpoint
- Test in sandbox mode first

## 📊 Performance Metrics

### Target Metrics

- Lighthouse Score: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Bundle size: <500KB (gzipped)

### Optimization Techniques Applied

- Code splitting by routes
- Lazy loading images
- Memoized expensive calculations
- Debounced search inputs
- Optimized re-renders with React.memo

## 📄 License

Private project - UTE University

## 👥 Team

Frontend Development Team - UTE WebsiteLuyenThiTiengAnh

---

**Happy Coding! 🚀**
gender?: string;
birthday: Date;
phone: string;
bio?: string;
avatar?: string;
};
instructorInfo: {
position?: string;
specialization?: string;
experience?: string;
education?: string;
};
role: "guest" | "registered" | "paid" | "free" | "admin" | "instructor";
purchasedCourses: string[];
wishList: string[];
}

````

#### Course Schema

```typescript
interface ICourse {
  title: string;
  description: string;
  type: "pre-recorded" | "live-meet";
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  targetScoreRange: { min: number; max: number };
  courseStructure: {
    totalSessions: number;
    hoursPerSession: number;
    totalHours: number;
  };
  preRecordedContent?: {
    totalTopics: number;
    totalLessons: number;
    accessDuration: number;
    videoLessons: Array<{
      title: string;
      url: string;
      duration?: string;
    }>;
  };
}
````

#### Other Key Models

- **Class**: Quản lý lớp học trực tiếp
- **Enrollment**: Đăng ký khóa học
- **Attendance**: Điểm danh học viên
- **Test**: Bài kiểm tra TOEIC
- **Question**: Câu hỏi trong bài test
- **UserProgress**: Tiến độ học tập
- **Payment**: Giao dịch thanh toán
- **Review**: Đánh giá khóa học

## 🔐 Authentication & Authorization

### Role-based Access Control

- **Guest**: Truy cập basic (xem khóa học, làm test miễn phí)
- **Registered**: Đã đăng ký (truy cập thêm tính năng)
- **Free/Paid**: Học viên (dựa trên khóa học đã mua)
- **Instructor**: Giảng viên (quản lý lớp học, điểm danh)
- **Admin**: Quản trị viên (full access)

### Protected Routes

```jsx
// Student routes
<Route element={<StudentProtectedRouter />}>
  <Route path="/profile" element={<Profile />} />
  <Route path="/my-schedule" element={<MySchedulePage />} />
</Route>

// Instructor routes
<Route element={<InstructorProtectedRouter />}>
  <Route path="/instructor" element={<InstructorDashboard />} />
</Route>
```

### JWT Implementation

- **Access Token**: Short-lived (15 phút)
- **Refresh Token**: Long-lived (7 ngày)
- **Auto-refresh**: Tự động gia hạn token
- **Logout**: Blacklist refresh token

## 🎯 Tính năng chính

### Học viên (Students)

- ✅ Đăng ký/Đăng nhập với OTP
- ✅ Làm bài test miễn phí (Free Entry Test)
- ✅ Xem và đăng ký khóa học
- ✅ Thanh toán VNPay
- ✅ Học từ vựng
- ✅ Theo dõi tiến độ học tập
- ✅ Quản lý profile cá nhân
- ✅ Xem lịch học

### Giảng viên (Instructors)

- ✅ Dashboard quản lý
- ✅ Quản lý lớp học
- ✅ Điểm danh học viên
- ✅ Tạo và quản lý nội dung
- ✅ Theo dõi tiến độ lớp

### Hệ thống (System)

- ✅ Authentication với JWT
- ✅ Role-based authorization
- ✅ Email OTP verification
- ✅ File upload (Cloudinary)
- ✅ Payment integration (VNPay)
- ✅ Real-time data sync
- ✅ Progress tracking

## 🚀 Cài đặt và chạy dự án

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm/yarn

### Backend Setup

```bash
cd UTE_WebsiteLuyenThiTiengAnh_BE
npm install
```

### Environment Variables (.env)

```env
PORT=3001
DB_NAME=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
SECRET_KEY=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email
```

### Run Backend

```bash
npm run dev    # Development
npm run build  # Production build
npm start      # Production
```

### Frontend Setup

```bash
cd UTE_WebsiteLuyenThiTiengAnh_FE
npm install
```

### Run Frontend

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
```

## 📡 API Endpoints

### Authentication

- `POST /users/login` - Đăng nhập
- `POST /users/send-otp-register` - Gửi OTP đăng ký
- `POST /users/verify-otp-register` - Xác thực OTP
- `POST /users/refresh-token` - Refresh access token
- `POST /users/logout` - Đăng xuất

### User Management

- `GET /users/me` - Thông tin user hiện tại
- `PUT /users/update-profile` - Cập nhật profile
- `GET /users/upload-signature` - Cloudinary signature

### Courses

- `GET /courses` - Danh sách khóa học
- `GET /courses/:id` - Chi tiết khóa học
- `POST /courses` - Tạo khóa học (instructor)

### Classes & Enrollment

- `GET /classes` - Danh sách lớp học
- `POST /enrollments` - Đăng ký lớp học
- `GET /enrollments/my-classes` - Lớp học của tôi

### Attendance (Instructor)

- `GET /attendance/class/:classId` - Danh sách điểm danh
- `PUT /attendance/update` - Cập nhật điểm danh

### Tests

- `GET /tests` - Danh sách bài test
- `POST /tests/:id/submit` - Nộp bài test
- `GET /freeentrytest` - Free entry test

### Payment

- `POST /payment/create-payment` - Tạo payment VNPay
- `GET /payment/vnpay-return` - Xử lý callback VNPay

## 🔧 Configuration

### Vite Config (Frontend)

```javascript
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### TypeScript Config (Backend)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    }
  }
}
```

### Tailwind Config

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          /* custom colors */
        },
      },
    },
  },
};
```

## 📊 Performance Features

### Frontend Optimizations

- **Code Splitting**: Route-based lazy loading
- **State Persistence**: Redux Persist
- **Caching**: Axios interceptors
- **Image Optimization**: Cloudinary integration
- **Bundle Analysis**: Vite bundle analyzer

### Backend Optimizations

- **Database Indexing**: MongoDB indexes
- **Query Optimization**: Mongoose aggregation
- **Caching Strategy**: In-memory caching
- **Data Sync**: Real-time attendance sync
- **Error Handling**: Comprehensive error middleware

## 🧪 Testing & Quality

### Code Quality Tools

- **ESLint**: Linting rules
- **Prettier**: Code formatting
- **TypeScript**: Type checking
- **Validation**: Yup schemas + Express Validator

### Development Tools

- **Nodemon**: Auto-restart server
- **Hot Reload**: Vite HMR
- **API Testing**: Postman collection included

## 🚀 Deployment

### Production Build

```bash
# Backend
npm run build
npm start

# Frontend
npm run build
npm run preview
```

### Environment Setup

- Set production environment variables
- Configure MongoDB production database
- Set up email service (Gmail SMTP)
- Configure VNPay merchant credentials

## 📝 Development Notes

### Recent Updates

- ✅ Fixed attendance sync issues
- ✅ Implemented role-based routing
- ✅ Added logout confirmation modal
- ✅ Enhanced error handling in components
- ✅ Improved instructor dashboard functionality

### Known Issues

- None currently reported

### Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Video call integration for live classes
- [ ] AI-powered learning recommendations
- [ ] Multi-language support

## 👥 Contributors

- **Development Team**: UTE Students
- **Backend**: Node.js/Express/MongoDB
- **Frontend**: React/Redux/Tailwind
- **UI/UX**: Modern responsive design

## 📄 License

This project is developed for educational purposes at UTE (University of Technology and Education).

---

_Last updated: November 2025_
