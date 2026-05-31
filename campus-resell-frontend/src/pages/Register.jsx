import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { formCard, formTitle, inputClass, labelClass, linkClass, pageBackground, submitBtn } from "../styles/common";
import { useNavigate } from "react-router";
import userAuthStore from "../stores/authStore";
import toast from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  const registerUser = userAuthStore((state) => state.register);

  const onFileSelect = (e) => {
    //get image file
    const file = e.target.files[0];
    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Only JPG or PNG allowed");
        return;
      }
      //validation for file size
      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
      //Converts file → temporary browser URL(create preview URL)
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setError(null);
    }
  };

  //cleanup (remove preview image from browser memory)
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const submitForm = async (data) => {
    //create form object (to handle profile image)
    const formData = new FormData();
    let { profileUrl, ...userObj } = data;
    //add all fields except profilePic to FormData object
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    // add profilePic to Formdata object
    if (profileUrl && profileUrl.length > 0) {
      formData.append("profileUrl", profileUrl[0]);
    }
    try {
      await registerUser(formData);
      toast.success("Account Created");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center px-2 py-2`}>
      <div className={`${formCard} w-full max-w-lg py-10`}>
        {/* Title */}
        <h2 className={formTitle}>Create Account</h2>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div className="flex gap-1 sm:gap-3">
            {/* FIRST NAME */}
            <div className="flex-1">
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={inputClass}
              />
              {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
            </div>
            {/* LAST NAME */}
            <div className="flex-1">
              <label className={labelClass}>Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className={inputClass}
              />
              {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
            </div>
          </div>

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

          {/* Profile Image */}
          <div className="flex flex-col gap-3">
            <label className={labelClass}>Upload Profile Image</label>

            {/* Preview */}
            {preview && (
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="
                  w-16 
                  h-16 
                  rounded-full 
                  object-cover 
                  border
                  border-gray-300
                "
                />
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="
              w-[50%]
              text-xs
              border
              border-gray-300
              rounded-md
              py-1
              px-2
              bg-white
              cursor-pointer
              file:text-xs
              file:px-2
              file:py-1
              file:mr-2
              file:border-0
              file:rounded
              file:bg-gray-600
              file:text-white
              file:cursor-pointer
            "
              {...register("profileUrl", {
                onChange: onFileSelect,
              })}
            />

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-[#6e6e73] mt-2">
            Already have an account?{" "}
            <span className={`${linkClass} underline cursor-pointer`} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

          {/* BUTTON */}
          <button type="submit" className={submitBtn}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
