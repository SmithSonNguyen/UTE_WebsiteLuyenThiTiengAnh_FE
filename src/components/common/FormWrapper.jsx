// src/components/common/FormWrapper.jsx
// Wrapper cho form để center và style chung
import React from "react";

const FormWrapper = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
