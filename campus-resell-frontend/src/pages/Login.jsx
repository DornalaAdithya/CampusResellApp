import React from "react";
import { useForm } from "react-hook-form";
import { formCard, formTitle, inputClass, labelClass, linkClass, pageBackground, primaryBtn, submitBtn } from "../styles/common";
import { useNavigate } from "react-router";
import userAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const login = userAuthStore((state) => state.login);
  const loading = userAuthStore((state) => state.loading);
  const submitForm = async (data) => {
    try {
      await login(data);
      toast.success("Welcome Back");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Login Failed");
    }
  };
  return (
    <div className={`${pageBackground} flex items-center justify-center px-4 py-4`}>
      <div className={`${formCard} w-110 max-w-lg py-10`}>
        {/* Title */}
        <h2 className={formTitle}>Login</h2>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          {/* EMAIL */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              placeholder="mail@anurag.edu.in"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@anurag\.edu\.in$/i,
                  message: "Invalid email address",
                },
              })}
              className={inputClass}
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* PASSWORD */}
          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
              className={inputClass}
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          {/* REGISTER LINK */}
          <p className="text-center text-sm text-[#6e6e73] mt-2">
            Don’t have an account?{" "}
            <span className={`${linkClass} underline cursor-pointer`} onClick={() => navigate("/register")}>
              Register
            </span>
          </p>

          {/* BUTTON */}
          <button type="submit" className={submitBtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
