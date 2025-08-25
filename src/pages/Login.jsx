// src/pages/Login.jsx
// Sử dụng form với email/password, nút submit, link đến Register/Forgot.
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import FormWrapper from "../components/common/FormWrapper";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // Call API here
  };

  return (
    <FormWrapper title="Login to Practice English">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          register={register("email")}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          register={register("password")}
          error={errors.password}
        />
        <Button type="submit" loading={isSubmitting}>
          Login
        </Button>
      </form>
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
      <div className="text-center mt-2">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Login;
