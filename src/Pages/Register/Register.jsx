import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router"; // react-router-dom here
import Swal from "sweetalert2";
import { useState, useContext } from "react";
import axios from "axios";
import UseAxios from "../../Hooks/UseAxios";
import { AuthContext } from "../../Context/AuthProvider";
// import { AuthContext } from "../../Context/AuthProvider";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { createUser, updateProfile } = useContext(AuthContext); // Ensure your AuthContext exports createUser
  const [photo, setPhoto] = useState('');
//   const axiosPublic = UseAxios();
  const navigate = useNavigate();


 const onSubmit = (data) => {
    console.log("Register Form Data:", data);
    const {email,password}=  data;
    console.log(email,password)
    


  

    createUser(email,password)
    .then(async (userCredential) => {
    // Signed up 
    const user = userCredential.user;


      const userInfo ={

      email: data.email,
      role:'customer' ,
      created_at : new Date().toISOString(),
      last_log_at: new Date().toISOString()


    }
     await axios.post('http://localhost:5000/users',userInfo)
   .then(res =>{
    console.log(res.data)
   })
   .catch(error =>{
    console.log(error)
   })



    const profileInfo ={
      displayName: data.name,
      photoURL:photo
    }
   updateProfile(profileInfo)
    .then( () =>{
      console.log('success uploaded')

    })
    .catch(error =>{
      console.log(error)
    })
      Swal.fire({
      title: "Account Created  Successfully!",
      icon: "success",
      draggable: true
    });
    navigate('/')
    console.log(user)
    // ...
  })
  .catch((error) => {
   console.log(error)
    // ..
  });
  };
  const handleUploadPhoto = async (e) => {
  const image = e.target.files[0];
  console.log(image)
  
  const formData = new FormData();
  formData.append('image', image);

  const imageUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_Image_Key}`;

  try {
    const res = await axios.post(imageUrl, formData);
    setPhoto(res.data.data.url);
  } catch (err) {
    console.error("Image upload error:", err);
  }
};























  return (
    <div className="w-full max-w-md space-y-6 mx-auto p-6">
      <h2 className="text-3xl font-extrabold text-center text-primary">Create an Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
            placeholder="Your Full Name"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

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
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                message: "Must include uppercase, lowercase, and number",
              },
            })}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Upload Your Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadPhoto}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {/* Register Button */}
        <button type="submit" className="btn btn-primary w-full text-white">
          Register
        </button>
      </form>

      {/* Redirect to Login */}
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
