# Website Luyện Thi Tiếng Anh TOEIC

Hệ thống học tập và quản lý khóa học tiếng Anh TOEIC với đầy đủ tính năng cho học viên và giảng viên.

## 📋 Tổng quan dự án

### Mô tả

Website học tiếng Anh TOEIC tích hợp với các tính năng:

- **Học viên**: Làm bài test, học từ vựng, đăng ký khóa học, theo dõi tiến độ
- **Giảng viên**: Quản lý lớp học, điểm danh, tạo nội dung
- **Hệ thống**: Thanh toán VNPay, quản lý người dùng, theo dõi tiến độ

### Công nghệ sử dụng

#### Frontend (React)

- **Framework**: React 19.1.1 + Vite
- **State Management**: Redux Toolkit + Redux Persist
- **UI Libraries**:
  - Radix UI (components)
  - Tailwind CSS (styling)
  - Ant Design (select components)
  - Framer Motion (animations)
- **Routing**: React Router DOM 7.9.5
- **Form Handling**: React Hook Form + Yup validation
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Authentication**: JWT Decode
- **Notifications**: React Hot Toast, React Toastify

#### Backend (Node.js)

- **Framework**: Express 5.1.0
- **Database**: MongoDB + Mongoose 8.18.0
- **Authentication**: JWT + bcrypt
- **Validation**: Express Validator
- **Email**: Nodemailer
- **Payment**: VNPay integration
- **Development**: TypeScript + Nodemon

## 🏗️ Kiến trúc hệ thống

### Frontend Structure

```
src/
├── components/
│   ├── common/          # Shared components (Button, Input, Modal...)
│   ├── auth/            # Authentication components
│   ├── course/          # Course-related components
│   ├── test/            # Test/exam components
│   ├── profile/         # User profile components
│   ├── instructor/      # Instructor dashboard components
│   └── layouts/         # Layout components
├── pages/
│   ├── auth/            # Login, Register, ForgotPassword
│   ├── course/          # Course detail, schedule, classes
│   ├── test/            # Test pages (free entry, online tests)
│   ├── profile/         # User profile management
│   ├── instructor/      # Instructor dashboard
│   └── payment/         # Payment result pages
├── redux/               # State management
├── routes/              # Route configuration
├── api/                 # API service layers
├── utils/               # Utility functions
└── assets/              # Static assets
```

### Backend Structure

```
src/
├── controllers/         # Request handlers
├── middlewares/         # Authentication, validation middlewares
├── models/
│   ├── schemas/         # Mongoose schemas
│   ├── requests/        # Request type definitions
│   └── types/           # Custom type definitions
├── routes/              # API route definitions
├── services/            # Business logic layer
├── utils/               # Helper functions
└── constants/           # Configuration constants
```

## 🗄️ Database Models

### Core Entities

#### User Schema

```typescript
interface IUser {
  password: string;
  isVerified: boolean;
  profile: {
    lastname: string;
    firstname: string;
    email: string;
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
```

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
```

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
