import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import {
  sendOTPApi,
  verifyOTPResetPassword,
  resetPassword,
} from "@/api/otpApi";
import { toast } from "react-toastify";
import getTokenRole from "@/utils/getTokenRole";
import isTokenValid from "@/utils/isTokenValid";

const emailSchema = yup.object({
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});

const otpSchema = yup.object({
  otp: yup
    .string()
    .length(6, "OTP phải có đúng 6 chữ số")
    .required("OTP là bắt buộc"),
});

const passwordSchema = yup.object({
  new_password: yup.string(),
  confirm_password: yup.string(),
});

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
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
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    reset: resetEmail,
  } = useForm({
    resolver: yupResolver(emailSchema),
  });

  const {
    register: registerOTP,
    handleSubmit: handleSubmitOTP,
    formState: { isSubmitting: isOTPSubmitting },
    reset: resetOTP,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPasswordForm,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
    mode: "onChange",
    reValidateMode: "onBlur",
    shouldFocusError: false,
  });

  // Countdown timer (giữ nguyên)
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset forms khi step thay đổi để clear autofill (gộp 2 useEffect thành 1 để tránh conflict)
  useEffect(() => {
    if (step === 1) {
      resetEmail();
      resetOTP();
      resetPasswordForm();
      setErrorMessage("");
    } else if (step === 2) {
      resetEmail();
      resetOTP();
      resetPasswordForm();
      setErrorMessage("");
    } else if (step === 3) {
      // THÊM: Clear errors và reset explicit với defaultValues
      clearErrors(); // Clear bất kỳ errors nào từ trước
      resetPasswordForm({
        new_password: "",
        confirm_password: "",
      });
      setErrorMessage("");

      // Clear autofill sau mount (tăng timeout lên 200ms để catch browser autofill chậm hơn)
      const timer = setTimeout(() => {
        setValue("new_password", "", { shouldValidate: false });
        setValue("confirm_password", "", { shouldValidate: false });
        clearErrors(); // Clear lại sau setValue nếu có trigger ngầm
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [step, resetEmail, resetOTP, resetPasswordForm, setValue, clearErrors]);

  const onSubmitEmail = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const result = await sendOTPApi(data, "reset_password");

      setUserEmail(data.email);

      if (result.status === 400) {
        //setErrorMessage(result.message || "Failed to send OTP");
        toast.error(result.message || "Failed to send OTP");
        return;
      }

      setStep(2);
      setCountdown(300);

      if (result.result?.development) {
        toast.success(
          `OTP sent! Development mode: Use OTP ${result.result.otp}`
        );
      } else {
        toast.success("OTP đã được gửi thành công");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      setErrorMessage(error.response?.data?.message || "Failed to send OTP");
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOTP = async (data) => {
    try {
      setIsLoading(true);

      const result = await verifyOTPResetPassword(userEmail, data.otp);
      if (result.status === 400) {
        //setErrorMessage(result.message || "Invalid or expired OTP");
        toast.error(result.message || "Invalid or expired OTP");
        resetOTP({ otp: "" });
        return;
      }

      setStep(3);
      toast.success("Xác nhận OTP thành công!");
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Clear error trước submit

      await resetPassword(userEmail, data.new_password, data.confirm_password);

      toast.success("Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      const backendErrors = error.errors;
      if (backendErrors) {
        // Lặp qua tất cả errors và toast từng cái
        Object.values(backendErrors).forEach((err) => {
          if (err.msg) toast.error(err.msg);
        });
        //setErrorMessage("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const result = await sendOTPApi({
        email: userEmail,
        purpose: "reset_password",
      });
      setCountdown(300);
      resetOTP();

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

  const handleBackToEmail = () => {
    setStep(1);
    setCountdown(0);
    resetOTP();
  };

  const handleOTPFocus = () => {
    setErrorMessage("");
  };

  const handleEmailFocus = () => {
    setErrorMessage("");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Step 1: Email Input
  if (step === 1) {
    return (
      <FormWrapper title="Quên Mật Khẩu">
        <p className="text-center text-gray-600 mb-6">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một OTP để đặt
          lại mật khẩu.
        </p>
        <form
          key={`email-form-${step}`}
          onSubmit={handleSubmitEmail(onSubmitEmail)}
        >
          <Input
            label="Email"
            type="email"
            register={registerEmail("email")}
            error={emailErrors.email}
            autoComplete="email"
            onFocus={handleEmailFocus}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm my-2">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={isEmailSubmitting || isLoading}
              disabled={isEmailSubmitting || isLoading}
            >
              Gửi OTP
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-600 hover:underline">
            Quay lại Đăng nhập
          </Link>
        </div>
      </FormWrapper>
    );
  }

  // Step 2: OTP Verification
  if (step === 2) {
    return (
      <FormWrapper title="Xác thực OTP">
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

        <form key={`otp-form-${step}`} onSubmit={handleSubmitOTP(onSubmitOTP)}>
          <Input
            key={`otp-input-${step}`}
            label="Nhập mã OTP"
            type="text"
            placeholder="Nhập mã OTP 6 chữ số"
            register={registerOTP("otp")}
            name="otp"
            maxLength={6}
            className="text-center text-2xl tracking-widest w-full"
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            onFocus={handleOTPFocus}
          />
          {errorMessage && (
            <p className="text-red-500 text-sm my-2">{errorMessage}</p>
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              loading={isOTPSubmitting || isLoading}
              disabled={isOTPSubmitting || isLoading}
            >
              Xác nhận OTP
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
                ? `Gửi lại OTP (${formatTime(countdown)})`
                : "Gửi lại OTP"}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBackToEmail}
              disabled={isLoading}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </FormWrapper>
    );
  }

  // Step 3: New Password
  return (
    <FormWrapper title="Đặt Lại Mật Khẩu">
      <p className="text-center text-gray-600 mb-6">
        Nhập mật khẩu mới của bạn bên dưới.
      </p>
      <form
        key={`password-form-${step}`}
        onSubmit={handleSubmitPassword(onSubmitPassword)}
      >
        <Input
          key={`password-input-${step}`}
          label="Mật khẩu mới"
          type="password"
          register={registerPassword("new_password")}
          //name="new-password"
          error={passwordErrors.new_password}
          autoComplete="new-password"
        />
        <Input
          key={`confirm-password-input-${step}`}
          label="Xác nhận mật khẩu mới"
          type="password"
          register={registerPassword("confirm_password")}
          //name="new-confirm-password"
          error={passwordErrors.confirm_password}
          autoComplete="new-password"
        />
        {/* {errorMessage && (
          <p className="text-red-500 text-sm my-2 text-center">
            {errorMessage}
          </p>
        )} */}
        <div className="flex justify-center">
          <Button
            type="submit"
            loading={isPasswordSubmitting || isLoading}
            disabled={isPasswordSubmitting || isLoading}
          >
            Đặt lại mật khẩu
          </Button>
        </div>
      </form>
      <div className="text-center mt-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Quay lại Đăng nhập
        </Link>
      </div>
    </FormWrapper>
  );
};

export default ForgotPassword;
