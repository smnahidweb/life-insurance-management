import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import axios from "axios";

import UseAxios from "../../Hooks/UseAxios";
import { AuthContext } from "../../Context/AuthProvider";


const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();
  const axiosPublic = UseAxios();

  const handleUploadPhoto = async (e) => {
    const image = e.target.files[0];
    if (!image) return;
    const formData = new FormData();
    formData.append("image", image);

    const imageUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`;
    try {
      const res = await axios.post(imageUrl, formData);
      const url = res.data.data.url;
      setPhotoURL(url);
      Swal.fire("Success", "Photo uploaded", "success");
    } catch (err) {
      console.error("Image upload failed:", err);
      Swal.fire("Error", "Failed to upload image", "error");
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password } = data;

    try {
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      await updateUserProfile({ displayName: name, photoURL });

      const userInfo = {
        name,
        email,
        photoURL,
        role: "customer",
        created_at: new Date().toISOString(),
        last_log_at: new Date().toISOString()
      };

      await axiosPublic.post("/users", userInfo);

      Swal.fire("Account Created!", "Welcome to LifeSure!", "success");
      navigate("/login");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message || "Something went wrong", "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 py-4">
      <div className="w-full max-w-md rounded-lg p-8 bg-white shadow">
        <h2 className="text-3xl font-extrabold text-center text-primary mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
              placeholder="Your Full Name"
            />
            {errors.name && <p className="text-red-600 mt-1 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="input input-bordered w-full"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-600 mt-1 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters required" },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])/,
                  message: "Password must contain uppercase and lowercase letters",
                },
              })}
              className="input input-bordered w-full"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-600 mt-1 text-sm">{errors.password.message}</p>}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUploadPhoto}
              className="file-input file-input-bordered w-full"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-full text-white font-semibold">
            Register
          </button>
        </form>

        {/* Redirect to Login */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
