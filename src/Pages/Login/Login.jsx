import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import Swal from "sweetalert2";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  // Placeholder login function (replace with real auth)
  const loginUser = async (email, password) => {
    // Simulate login success/failure
    if (email === "test@example.com" && password === "Password1") {
      return { user: { email } };
    }
    throw new Error("Invalid email or password");
  };

  // Placeholder Google login (replace with real Google auth)
  const loginWithGoogle = async () => {
    Swal.fire("Google Login", "Google login clicked (implement auth)", "info");
    // After success, redirect
    navigate("/");
  };

  const onSubmit = async (data) => {
    try {
      const userCredential = await loginUser(data.email, data.password);
      Swal.fire("Success", `Welcome back, ${userCredential.user.email}`, "success");
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      <h2 className="text-3xl font-extrabold text-center text-primary">Login to Your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <hr className="flex-1 border-gray-300" />
        <span className="text-gray-400 text-sm">or</span>
        <hr className="flex-1 border-gray-300" />
      </div>

      {/* Google Login Button */}
      <button
        onClick={loginWithGoogle}
        className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
      >
        <FcGoogle className="text-xl" />
        <span className="font-medium">Continue with Google</span>
      </button>

      {/* Redirect to Register */}
      <p className="text-sm text-gray-600 text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
