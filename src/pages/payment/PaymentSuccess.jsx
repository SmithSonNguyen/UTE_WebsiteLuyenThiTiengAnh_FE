// src/pages/PaymentSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const paymentId = searchParams.get("paymentId");
    const enrollmentId = searchParams.get("enrollmentId");

    // Lấy thông tin payment từ localStorage
    const pendingPayment = localStorage.getItem("pendingPayment");
    if (pendingPayment) {
      setPaymentInfo(JSON.parse(pendingPayment));
      // Clear localStorage
      localStorage.removeItem("pendingPayment");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công!
        </h1>
        <p className="text-gray-600 mb-6">
          Bạn đã đăng ký khóa học thành công. Hãy kiểm tra email để nhận thông
          tin chi tiết.
        </p>

        {paymentInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Thông tin đăng ký:</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {paymentInfo.classCode && (
                <p>
                  Lớp học:{" "}
                  <span className="font-medium">{paymentInfo.classCode}</span>
                </p>
              )}
              <p>
                Mã thanh toán:{" "}
                <span className="font-medium">
                  {paymentInfo.paymentId?.slice(0, 8)}...
                </span>
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/my-courses")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Xem khóa học của tôi
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
