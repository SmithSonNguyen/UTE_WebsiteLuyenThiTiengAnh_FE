/**
 * Đây là Popup modal hiển thị khi người dùng truy cập nút "Bắt đầu" trong toeic-home
 */

import React from "react";
import { useNavigate } from "react-router-dom";

const StartModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative flex w-[488px] flex-col items-center rounded-2xl bg-white px-6 py-10 max-[488px]:w-full md:px-10">
        {/* Header */}
        <div className="flex w-full justify-between">
          <div className="w-7"></div>
          <a href="/vi/">
            <img
              src="../../../public/Superman_shield.svg.png"
              alt="Logo"
              className="h-10 w-auto md:h-12 lg:h-14 2xl:h-16 object-contain"
            />
          </a>
          <button onClick={onClose}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="xmark"
              className="size-7 min-w-7 cursor-pointer text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 
                   0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 
                   0s-9.4 24.6 0 33.9l119 119L39 
                   375c-9.4 9.4-9.4 24.6 0 
                   33.9s24.6 9.4 33.9 
                   0l119-119L311 409c9.4 9.4 24.6 
                   9.4 33.9 0s9.4-24.6 
                   0-33.9l-119-119L345 137z"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-10 text-center text-base font-bold tracking-[0.08px] text-neutral-500 md:text-lg md:tracking-[0.1px]">
          Tham gia ngay cùng Prep - Nền tảng học và luyện thi thông minh
        </div>

        <div className="mt-12 w-full space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full p-4 text-md font-bold rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 max-md:py-3 max-md:font-semibold"
          >
            Đăng nhập
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full p-4 text-md font-bold rounded-lg border border-blue-500 bg-white text-blue-500 hover:bg-blue-100 focus:ring-4 focus:ring-blue-200 max-md:py-3 max-md:font-semibold"
          >
            Đăng ký
          </button>
        </div>

        <div className="my-4 h-px w-full bg-neutral-200"></div>

        <div className="text-center text-xs text-neutral-500">
          Bằng cách tham gia, bạn xác nhận đã đọc và đồng ý với{" "}
          <a
            href="https://prepedu.com/vi/terms-and-conditions-of-transactions"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-500"
          >
            Điều khoản &amp; Điều kiện
          </a>{" "}
          cùng{" "}
          <a
            href="https://prepedu.com/vi/personal-information-protection-policy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-blue-500"
          >
            Chính sách bảo mật
          </a>{" "}
          của Prep
        </div>
      </div>
    </div>
  );
};

export default StartModal;
