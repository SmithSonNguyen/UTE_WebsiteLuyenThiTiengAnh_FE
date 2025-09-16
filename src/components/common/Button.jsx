// src/components/ui/Button.jsx
import React from "react";
import clsx from "clsx";

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  link: "text-blue-600 underline-offset-4 hover:underline bg-transparent",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const Button = ({
  children,
  type = "button",
  loading = false,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={loading || props.disabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
