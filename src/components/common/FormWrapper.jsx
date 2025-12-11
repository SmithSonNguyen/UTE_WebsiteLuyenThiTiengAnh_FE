// src/components/common/FormWrapper.jsx
// Wrapper cho form để center và style chung
import React from "react";

const FormWrapper = ({ title, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <img
          src="../../../public/Superman_shield.svg.png"
          alt="Logo DTT"
          className="h-8 w-auto md:h-12 lg:h-14 2xl:h-16 object-contain mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
