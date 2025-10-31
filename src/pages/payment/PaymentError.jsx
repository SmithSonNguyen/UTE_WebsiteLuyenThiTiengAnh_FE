// src/pages/PaymentError.jsx
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PaymentError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message =
    searchParams.get("message") ||
    "Có lỗi xảy ra trong quá trình xử lý thanh toán";

  useEffect(() => {
    localStorage.removeItem("pendingPayment");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h1>
        <p className="text-gray-600 mb-6">{decodeURIComponent(message)}</p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            Vui lòng thử lại sau hoặc liên hệ với chúng tôi để được hỗ trợ.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quay lại
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

export default PaymentError;
