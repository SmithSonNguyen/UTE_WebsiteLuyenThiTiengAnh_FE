import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart3, User, ShoppingCart, BookOpen } from "lucide-react";
import StatsCard from "@/components/common/admin/StatsCard";
import RevenueChart from "@/components/common/admin/RevenueChart";
import WeeklySalesCard from "@/components/common/admin/WeeklySalesCard";
import TopStudents from "@/components/common/admin/TopStudents";

const DashboardContent = () => {
  // Lấy accessToken từ Redux store
  const accessToken = useSelector((state) => state.auth.login.accessToken);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [topStudents, setTopStudents] = useState([]);
  const [loadingTop, setLoadingTop] = useState(true);

  // Thêm hàm fetch top students
  const fetchTopStudents = async () => {
    try {
      setLoadingTop(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/top-students`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to fetch top students");

      const result = await response.json();
      setTopStudents(result.data || []);
    } catch (err) {
      console.error("Error fetching top students:", err);
      // Không set error toàn trang, chỉ log thôi
    } finally {
      setLoadingTop(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchDashboardData();
      fetchTopStudents();
    }
  }, [accessToken]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (!accessToken) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/overview-dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const result = await response.json();
      setDashboardData(result.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Calculate change percentage (mock data - you may want to add comparison data from backend)
  const calculateChange = () => {
    // This is mock data. In real scenario, you'd compare with previous period from backend
    return {
      revenue: 0,
      users: 0,
      enrollments: 0,
      courses: 0, // No change as courses are relatively static
    };
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          <p className="font-semibold">Error loading dashboard data</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const changes = calculateChange();
  const overview = dashboardData?.overview || {};

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(overview.total_revenue || 0),
      change: changes.revenue,
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Users",
      value: (overview.total_users || 0).toLocaleString(),
      change: changes.users,
      icon: User,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Enrollments",
      value: (overview.total_enrollments || 0).toLocaleString(),
      change: changes.enrollments,
      icon: ShoppingCart,
      color: "from-pink-500 to-pink-600",
    },
    {
      title: "Total Courses",
      value: (overview.total_courses || 0).toLocaleString(),
      change: changes.courses,
      icon: BookOpen,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart data={dashboardData} />
        <WeeklySalesCard data={dashboardData} />
      </div>

      <div className="lg:col-span-1">
        {loadingTop ? (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 4, 5].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <TopStudents topStudents={topStudents} />
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
