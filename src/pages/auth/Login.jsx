// src/pages/Login.jsx
// Sử dụng form với email/password, nút submit, link đến Register/Forgot.
import React, { useEffect } from "react"; // Thêm useEffect
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import FormWrapper from "@/components/common/FormWrapper";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { loginUser, clearLoginError } from "@/redux/authSlice"; // import thunk
import { useDispatch, useSelector } from "react-redux";
import getTokenRole from "@/utils/getTokenRole";
import isTokenValid from "@/utils/isTokenValid";
import { toast } from "react-toastify";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, errorMessage, accessToken } = useSelector(
    (state) => state.auth.login
  );

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

  useEffect(() => {
    dispatch(clearLoginError());
  }, [dispatch]); // Chỉ chạy một lần khi mount
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const resultAction = await dispatch(loginUser(data));
      if (loginUser.fulfilled.match(resultAction)) {
        // login thành công - kiểm tra role để redirect
        const token = resultAction.payload.access_token;
        const role = getTokenRole(token);

        if (role === "instructor") {
          navigate("/instructor"); // redirect đến instructor dashboard
        } else {
          navigate("/toeic-home"); // redirect đến trang chủ cho student
        }

        toast.success("Đăng nhập thành công!");
      } else {
        // login thất bại, error sẽ hiển thị từ Redux
        console.log(resultAction.payload);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FormWrapper title="Đăng Nhập">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          register={register("email")}
          error={errors.email}
        />
        <Input
          label="Mật Khẩu"
          type="password"
          register={register("password")}
          error={errors.password}
        />
        {error && (
          <p className="text-red-600 text-sm my-2 ">
            {typeof errorMessage === "string" ? errorMessage : "Login failed"}
          </p>
        )}
        <div className="flex justify-center">
          <Button type="submit" loading={isLoading}>
            Đăng Nhập
          </Button>
        </div>
      </form>

      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-blue-600 hover:underline">
          Quên Mật Khẩu?
        </Link>
      </div>
      <div className="text-center mt-2">
        <p>
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng Ký
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};

export default Login;
