// src/pages/Register.jsx
// Tương tự Login nhưng thêm fields như name, confirm password.
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import FormWrapper from "../components/common/FormWrapper";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Register data:", data);
    // Call API here
  };

  return (
    <FormWrapper title="Register for English Practice">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Full Name"
          register={register("name")}
          error={errors.name}
        />
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
        <Input
          label="Confirm Password"
          type="password"
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />
        <Button type="submit" loading={isSubmitting}>
          Register
        </Button>
      </form>
      <div className="text-center mt-4">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Register;
