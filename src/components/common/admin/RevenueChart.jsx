import React, { useState, useMemo } from "react";
import { TrendingUp } from "lucide-react";

const RevenueChart = ({ data }) => {
  const [hoveredMonth, setHoveredMonth] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Format currency to VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Prepare monthly revenue data
  const monthlyData = useMemo(() => {
    if (!data?.monthly_revenue || !data?.recent_payments) return [];

    return data.monthly_revenue.map((monthRevenue) => {
      // Filter completed payments for this month
      const monthPayments = data.recent_payments.filter((payment) => {
        if (payment.status !== "completed") return false;

        const paymentDate = new Date(payment.completedAt || payment.createdAt);
        return (
          paymentDate.getFullYear() === monthRevenue.year &&
          paymentDate.getMonth() + 1 === monthRevenue.month
        );
      });

      return {
        ...monthRevenue,
        payments: monthPayments,
      };
    });
  }, [data]);

  // Calculate max revenue for scaling
  const maxRevenue = useMemo(() => {
    if (monthlyData.length === 0) return 1;
    return Math.max(...monthlyData.map((m) => m.revenue));
  }, [monthlyData]);

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e, monthData) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setHoveredMonth(monthData);
  };

  const handleMouseLeave = () => {
    setHoveredMonth(null);
  };

  if (!data || monthlyData.length === 0) {
    return (
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Revenue Overview
            </h3>
            <p className="text-sm text-gray-500">Monthly revenue statistics</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-400">
          No revenue data available
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
          <p className="text-sm text-gray-500">Monthly revenue statistics</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="font-semibold text-green-600">
            {formatCurrency(monthlyData.reduce((sum, m) => sum + m.revenue, 0))}
          </span>
          <span className="text-gray-500">Total</span>
        </div>
      </div>

      <div className="relative h-64 w-full">
        {/* Grid lines (tùy chọn, để đẹp hơn) */}
        <div className="absolute inset-0 flex flex-col justify-between px-2 py-8 pointer-events-none">
          {[75, 50, 25].map((line) => (
            <div key={line} className="border-t border-gray-200 w-full" />
          ))}
        </div>

        {/* Bars container - quan trọng nhất */}
        <div className="relative h-full flex items-end justify-between gap-3 px-2">
          {monthlyData.map((monthData, index) => {
            const heightPercent = (monthData.revenue / maxRevenue) * 100;
            const barHeight = Math.max(heightPercent, 4); // ít nhất 4% để thấy được

            return (
              <div
                key={index}
                className="flex flex-col justify-end items-center flex-1 group"
                style={{ height: "100%" }} // quan trọng: chiếm full chiều cao container
                onMouseMove={(e) => handleMouseMove(e, monthData)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Bar - giờ sẽ có height thực tế */}
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg cursor-pointer transition-all duration-300 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl hover:scale-y-105 origin-bottom"
                  style={{ height: `${barHeight}%` }}
                >
                  {/* Label trên đầu cột khi hover */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatCurrency(monthData.revenue)}
                  </div>
                </div>

                {/* Tên tháng */}
                <p className="mt-3 text-xs font-medium text-gray-600 whitespace-nowrap">
                  {monthData.month_name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Tooltip */}
      {hoveredMonth && (
        <div
          className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-80 max-h-96 overflow-y-auto"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {/* Tooltip Header */}
          <div className="mb-3 pb-3 border-b border-gray-200">
            <h4 className="font-bold text-gray-800 text-base">
              {hoveredMonth.month_name} {hoveredMonth.year}
            </h4>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-500">
                {hoveredMonth.count} transactions
              </p>
              <p className="text-sm font-bold text-blue-600">
                {formatCurrency(hoveredMonth.revenue)}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          {hoveredMonth.payments && hoveredMonth.payments.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                Completed Payments
              </p>
              {hoveredMonth.payments.map((payment, idx) => (
                <div
                  key={payment._id}
                  className="bg-gray-50 rounded-lg p-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-gray-700 flex-1 line-clamp-2">
                      {payment.courseId?.title || "Unknown Course"}
                    </p>
                    <span className="font-bold text-blue-600 whitespace-nowrap">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[10px] mb-1">
                    {payment.orderInfo}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>
                      {formatDate(payment.completedAt || payment.createdAt)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      {payment.paymentMethod}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">
              No completed payments this month
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
