import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { sendOTPApi, verifyOTPRegister } from "../../api/otpApi";
import { toast } from "react-toastify";
import getTokenRole from "@/utils/getTokenRole";
import isTokenValid from "@/utils/isTokenValid";

const schema = yup.object({
  lastname: yup.string().required("Last name is required"),
  firstname: yup.string().required("First name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  birthday: yup.string().required("Birthday is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const otpSchema = yup.object({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const RegisterWithOTP = () => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const { accessToken } = useSelector((state) => state.auth.login);

  // Kiểm tra nếu đã đăng nhập thì redirect
  useEffect(() => {
    if (accessToken && isTokenValid(accessToken)) {
      const role = getTokenRole(accessToken);
      if (role === "instructor") {
        navigate("/instructor", { replace: true });
      } else {
        navigate("/toeic-home", { replace: true });
      }
    }
  }, [accessToken, navigate]);

  const {
    register: registerForm,
    handleSubmit: handleSubmitForm,
    formState: { errors: formErrors, isSubmitting: isFormSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { errors: otpErrors, isSubmitting: isOTPSubmitting },
    reset: resetOTP,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const onSubmitForm = async (data) => {
    try {
      setIsLoading(true);

      // Gửi toàn bộ data form để API có thể validate
      const result = await sendOTPApi(data, "register");

      setUserData(data);
      setUserEmail(data.email);
      setStep(2);
      setCountdown(300); // 5 minutes

      // Hiển thị thông báo phù hợp với development/production
      if (result.result?.development) {
        toast.success(
          `OTP sent! Development mode: Use OTP ${result.result.otp}`
        );
      } else {
        toast.success("OTP sent to your email successfully!");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data) => {
    try {
      setIsLoading(true);

      // Verify OTP first
      await verifyOTPRegister({ ...userData, otp: data.otp });

      toast.success("Đăng ký thành công!");

      // Redirect to home or dashboard
      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const result = await sendOTPApi(userData); // Gửi lại toàn bộ userData
      setCountdown(300);
      resetOTP();

      // Hiển thị thông báo phù hợp với development/production
      if (result.result?.development) {
        toast.success(
          `OTP resent! Development mode: Use OTP ${result.result.otp}`
        );
      } else {
        toast.success("OTP resent successfully!");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep(1);
    setCountdown(0);
    resetOTP();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (step === 1) {
    return (
      <FormWrapper title="Register for English Practice">
        <form onSubmit={handleSubmitForm(onSubmitForm)}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Last Name"
              register={registerForm("lastname")}
              error={formErrors.lastname}
            />
            <Input
              label="First Name"
              register={registerForm("firstname")}
              error={formErrors.firstname}
            />
          </div>
          <Input
            label="Email"
            type="email"
            register={registerForm("email")}
            error={formErrors.email}
          />
          <Input
            label="Birthday"
            type="date"
            register={registerForm("birthday")}
            error={formErrors.birthday}
          />
          <Input
            label="Password"
            type="password"
            register={registerForm("password")}
            error={formErrors.password}
          />
          <Input
            label="Confirm Password"
            type="password"
            register={registerForm("confirm_password")}
            error={formErrors.confirm_password}
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={isFormSubmitting || isLoading}
              disabled={isFormSubmitting || isLoading}
            >
              Send OTP
            </Button>
          </div>
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
  }

  return (
    <FormWrapper title="Verify OTP">
      <div className="text-center mb-6">
        <p className="text-gray-600 mb-2">
          Chúng tôi đã gửi một mã OTP đến email của bạn:
        </p>
        <p className="text-blue-600 font-semibold">{userEmail}</p>
        {countdown > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            OTP hết hạn trong: {formatTime(countdown)}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmitOTP(onSubmitOTP)}>
        <Input
          label="Nhập mã OTP"
          type="text"
          placeholder="Enter 6-digit OTP"
          register={registerOTP("otp")}
          error={otpErrors.otp}
          maxLength={6}
          className="text-center text-2xl tracking-widest w-full"
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            loading={isOTPSubmitting || isLoading}
            disabled={isOTPSubmitting || isLoading}
          >
            Verify & Register
          </Button>
        </div>
      </form>

      <div className="flex flex-col gap-2 mt-4">
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleResendOTP}
            disabled={countdown > 0 || isLoading}
          >
            {countdown > 0
              ? `Resend OTP (${formatTime(countdown)})`
              : "Resend OTP"}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToForm}
            disabled={isLoading}
          >
            Back to Form
          </Button>
        </div>
      </div>
    </FormWrapper>
  );
};

export default RegisterWithOTP;
