// src/pages/ForgotPassword.jsx
// Form đơn giản chỉ cần email để gửi reset link.
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Forgot Password email:", data.email);
    // Call API to send reset email
  };

  return (
    <FormWrapper title="Forgot Password">
      <p className="text-center text-gray-600 mb-6">
        Enter your email to receive a password reset link.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          register={register("email")}
          error={errors.email}
        />
        <Button type="submit" loading={isSubmitting}>
          Send Reset Link
        </Button>
      </form>
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </FormWrapper>
  );
};

export default ForgotPassword;
