import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";
import transporter from "../config/email.js";

config();

export const register = async (req, res, next) => {
  let cloudinaryResult;

  try {
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    const { firstName, lastName, email, password } = req.body;

    if (!email.toLowerCase().endsWith("@anurag.edu.in")) {
      throw {
        status: 400,
        message: "Only Anurag Organization email is allowed",
      };
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw {
        status: 409,
        message: "Email already registered",
      };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const hashedPassword = await hash(password, 10);

    const userDocument = new UserModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      profileUrl: cloudinaryResult?.secure_url,
      isEmailVerified: false,
      emailVerificationOTP: otp,
      emailVerificationExpires: otpExpires,
    });

    await userDocument.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "CampXConnect - Email Verification OTP",
      text: `Your CampXConnect verification OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.status(201).json({
      message: "Registration successful. OTP sent to your email.",
    });
  } catch (err) {
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw {
      status: 400,
      message: "Email required",
    };
  }
  if (!password) {
    throw {
      status: 400,
      message: "Password required",
    };
  }

  //find user with email
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user) {
    throw {
      status: 404,
      message: "Invalid Email",
    };
  }

  //if user valid ,but blocked by admin
  if (!user.isActive) {
    throw {
      status: 403,
      message: "User Is Blocked By Admin.",
    };
  }

  //check email verification
  if (!user.isEmailVerified) {
    throw {
      status: 403,
      message: "Please verify your email before logging in.",
    };
  }

  //compare password
  const match = await compare(password, user.password);
  if (!match) {
    throw {
      status: 401,
      message: "Invalid password",
    };
  }

  //generate jwt token
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      profileUrl: user.profileUrl,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" },
  );

  console.log("token created : ", token);

  //save the token as httpOnlyCookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({ message: "Login Successful", payload: userObj });
};

export const getProfile = async (req, res) => {
  const userId = req.user.userId;
  const user = await UserModel.findById(userId).select("firstName lastName profileUrl email");
  if (!user) {
    return res.status(404).json({ message: "user not found", payload: {} });
  }
  return res.status(200).json({ message: "user found", payload: user });
};

export const logout = async (req, res) => {
  // Clear the cookie named 'token'
  res.clearCookie("token", {
    // Must match original  settings
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ message: "Logged out Successfully" });
};

export const updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }
    const userId = req.user.userId;
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    const updatedUser = await UserModel.findByIdAndUpdate(userId, { profileUrl: cloudinaryResult.secure_url }, { new: true }).select(
      "firstName lastName email profileUrl",
    );

    res.status(200).json({
      message: "Profile photo updated",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    const user = await UserModel.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw {
        status: 400,
        message: "Email and OTP are required",
      };
    }

    const user = await UserModel.findOne({ email }).select("+emailVerificationOTP +emailVerificationExpires");

    if (!user) {
      throw {
        status: 404,
        message: "User not found",
      };
    }

    if (user.isEmailVerified) {
      throw {
        status: 400,
        message: "Email is already verified",
      };
    }

    if (!user.emailVerificationOTP || !user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      throw {
        status: 400,
        message: "OTP expired. Please request a new OTP.",
      };
    }

    if (user.emailVerificationOTP !== otp) {
      throw {
        status: 400,
        message: "Invalid OTP",
      };
    }

    user.isEmailVerified = true;
    user.emailVerificationOTP = null;
    user.emailVerificationExpires = null;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
