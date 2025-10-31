// src/pages/PaymentFailed.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get("message") || "Thanh toán không thành công";
  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    // Clear pending payment
    localStorage.removeItem("pendingPayment");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán không thành công
        </h1>
        <p className="text-gray-600 mb-6">{decodeURIComponent(message)}</p>

        {paymentId && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-red-800">
              Mã giao dịch:{" "}
              <span className="font-medium">{paymentId.slice(0, 8)}...</span>
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Về trang chủ
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Cần hỗ trợ? Liên hệ:</p>
          <a
            href="mailto:support@example.com"
            className="text-blue-600 hover:underline"
          >
            support@example.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
