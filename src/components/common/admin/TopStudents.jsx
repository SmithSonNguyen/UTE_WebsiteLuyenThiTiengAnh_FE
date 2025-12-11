// components/common/admin/TopStudents.jsx
import React from "react";
import { TrendingUp, ShoppingBag } from "lucide-react";

const TopStudents = ({ topStudents = [] }) => {
  if (!topStudents || topStudents.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Học Viên</h3>
        <p className="text-gray-500 text-center py-8">
          Chưa có dữ liệu học viên
        </p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          Top Paid Students
        </h3>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
          Value
        </span>
      </div>

      <div className="space-y-4">
        {topStudents.slice(0, 6).map((student, index) => (
          <div
            key={student.userId}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
          >
            {/* Ranking */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {index + 1}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {student.fullName.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {student.fullName}
              </p>
              <p className="text-sm text-gray-500 truncate">{student.email}</p>
              <div className="flex items-center gap-3 mt-1 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <ShoppingBag className="w-3 h-3" />
                  {student.total_courses} courses
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="text-right">
              <p className="font-bold text-lg text-gray-900">
                {formatCurrency(student.total_spent)}
              </p>
              <p className="text-xs text-gray-500">Paid</p>
            </div>
          </div>
        ))}
      </div>

      {topStudents.length > 6 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Và {topStudents.length - 6} học viên khác...
          </p>
        </div>
      )}
    </div>
  );
};

export default TopStudents;
