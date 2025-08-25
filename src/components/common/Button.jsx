// src/components/common/Button.jsx
import React from "react";

const Button = ({
  children,
  type = "button",
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading}
      className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
