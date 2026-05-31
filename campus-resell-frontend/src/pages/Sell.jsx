import React, { useEffect, useState } from "react";
import {
  bodyText,
  labelClass,
  pageBackground,
  pageTitleClass,
  sErrorText,
  sInputClass,
  sLabelClass,
  sPanelClass,
  sSectionSubTitle,
  sSectionTitle,
  sSelectClass,
  sSubmitBtn,
  sTextareaClass,
  subHeadingClass,
  sUploadBox,
  sUploadPlaceholder,
} from "../styles/common";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../api/axios";

function Sell() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [images, setImages] = useState(Array(5).fill(null));

  const onSelectImage = (e, index) => {
    const file = e.target.files[0];

    if (!file) return;

    // File validation
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Only JPG and PNG allowed");
      return;
    }

    // Size validation (2MB)
    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image must be less than 4MB");
      return;
    }

    const updatedImages = [...images];

    // cleanup old preview if replacing image
    if (updatedImages[index]?.preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }

    updatedImages[index] = {
      file,
      preview: URL.createObjectURL(file),
    };

    setImages(updatedImages);
  };

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img?.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const submitForm = async (data) => {
    try {
      // At least one image validation
      const hasAtLeastOneImage = images.some((img) => img !== null);

      if (!hasAtLeastOneImage) {
        toast.error("Please upload at least one image");

        return;
      }

      const formData = new FormData();

      // Append text fields
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      // Append images
      images.forEach((img) => {
        if (img?.file) {
          formData.append("productImages", img.file);
        }
      });

      // API Call
      await api.post("/products/", formData);

      toast.success("Product Posted");

      reset();

      // Cleanup previews
      images.forEach((img) => {
        if (img?.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });

      setImages(Array(5).fill(null));
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.error || err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className={`${pageBackground} min-h-screen py-8 px-4`}>
      {/* Heading */}
      <div className="mb-8">
        <h2 className={`${pageTitleClass} text-center`}>Sell on Campus</h2>

        <h4 className={`${subHeadingClass} text-center mt-2`}>List Your Product Here</h4>
      </div>

      {/* Main Form */}
      <form
        onSubmit={handleSubmit(submitForm)}
        className="
    max-w-8xl
    mx-auto
    grid
    grid-cols-1
    lg:grid-cols-2
    gap-8
    items-start
  "
      >
        {/* LEFT PANEL - Upload Images */}
        <div className={`${sPanelClass} p-5 sm:p-10`}>
          <div className="mb-6">
            <h3 className={sSectionTitle}>Upload Images</h3>

            <p className={sSectionSubTitle}>First image will be the cover photo*</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {images.map((image, index) => (
              <div key={index} className={sUploadBox}>
                {/* Preview */}
                {image ? (
                  <img
                    src={image.preview}
                    alt="Product"
                    className="
                w-full
                h-full
                object-cover
              "
                  />
                ) : (
                  <label htmlFor={`productImage-${index}`} className={sUploadPlaceholder}>
                    <span className="text-3xl font-light">+</span>

                    <span className="text-sm font-medium">Add Photo</span>
                  </label>
                )}

                {/* Cover Tag */}
                {index === 0 && image && (
                  <span
                    className="
                absolute
                top-3
                left-3
                bg-black/80
                text-white
                text-xs
                px-3
                py-1
                rounded-full
                font-medium
                backdrop-blur
              "
                  >
                    Cover
                  </span>
                )}

                {/* Hidden Input */}
                <input
                  type="file"
                  id={`productImage-${index}`}
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => onSelectImage(e, index)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL - Product Details */}
        <div className={`${sPanelClass} p-6`}>
          <div className="mb-6">
            <h3 className={sSectionTitle}>Product Details</h3>

            <p className={sSectionSubTitle}>Add information about your product</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className={sLabelClass}>Product Title</label>

              <input
                type="text"
                placeholder="MacBook Air M1 2020"
                className={sInputClass}
                {...register("title", {
                  required: "Product title required",

                  minLength: {
                    value: 3,
                    message: "Title must contain at least 3 characters",
                  },

                  maxLength: {
                    value: 100,
                    message: "Title cannot exceed 100 characters",
                  },
                })}
              />

              {errors.title && <p className={sErrorText}>{errors.title.message}</p>}
            </div>

            {/* Price */}
            <div>
              <label className={sLabelClass}>Price</label>

              <div className="relative">
                <span
                  className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-500
              text-sm
            "
                >
                  ₹
                </span>

                <input
                  type="number"
                  placeholder="5000"
                  className={`${sInputClass} pl-8`}
                  {...register("price", {
                    required: "Price required",

                    min: {
                      value: 1,
                      message: "Price must be greater than 0",
                    },
                  })}
                />
              </div>

              {errors.price && <p className={sErrorText}>{errors.price.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className={sLabelClass}>Category</label>

              <select
                className={sSelectClass}
                {...register("category", {
                  required: "Category required",
                })}
              >
                <option value="">Select Category</option>

                <option value="BOOKS">Books</option>

                <option value="ELECTRONICS">Electronics</option>

                <option value="CYCLES">Cycles</option>

                <option value="FURNITURE">Furniture</option>

                <option value="FASHION">Fashion</option>

                <option value="OTHERS">Others</option>
              </select>

              {errors.category && <p className={sErrorText}>{errors.category.message}</p>}
            </div>

            {/* Condition */}
            <div>
              <label className={sLabelClass}>Condition</label>

              <select className={sSelectClass} {...register("condition")}>
                <option value="NEW">New</option>

                <option value="LIKE_NEW">Like New</option>

                <option value="GOOD">Good</option>

                <option value="FAIR">Fair</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className={sLabelClass}>Description</label>

              <textarea
                rows="5"
                placeholder="Describe your product condition, usage, accessories included..."
                className={sTextareaClass}
                {...register("description", {
                  required: "Product description required",

                  minLength: {
                    value: 10,
                    message: "Description must contain at least 10 characters",
                  },

                  maxLength: {
                    value: 1000,
                    message: "Description cannot exceed 1000 characters",
                  },
                })}
              />

              {errors.description && <p className={sErrorText}>{errors.description.message}</p>}
            </div>

            {/* Negotiable */}
            <div
              className="
          flex
          items-center
          gap-3
          rounded-xl
          border
          border-gray-200
          bg-gray-50
          px-4
          py-3
        "
            >
              <input
                type="checkbox"
                id="negotiable"
                className="
            h-4
            w-4
            cursor-pointer
          "
                {...register("isNegotiable")}
              />

              <label
                htmlFor="negotiable"
                className="
            text-sm
            font-medium
            text-gray-700
            cursor-pointer
          "
              >
                Price Negotiable
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className={sSubmitBtn}>
              Post Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Sell;
