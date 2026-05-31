import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";
import cloudinary from "../config/cloudinary.js";

config();

export const register = async (req, res, next) => {
  let cloudinaryResult;
  try {
    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    const { firstName, lastName, email, password } = req.body;

    // validate email
    if (!email.toLowerCase().endsWith("@anurag.edu.in")) {
      throw {
        status: 400,
        message: "Only Anurag Organization email is allowed",
      };
    }

    // validate password
    //   const passwordRegex = /^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

    //   if (!passwordRegex.test(password)) {
    //     throw {
    //       status: 400,
    //       message: "Password must be at least 7 characters with one capital letter and one special character",
    //     };
    //   }

    // Step 2: call existing register()
    //create user document
    const userDocument = new UserModel({ firstName, lastName, email, password, profileUrl: cloudinaryResult?.secure_url });
    //validate
    await userDocument.validate();

    //hash the password
    const hashedPassword = await hash(password, 10);
    userDocument.password = hashedPassword;
    const created = await userDocument.save();
    //convert document to object to remove password (using .toObject)
    const newUserObj = created.toObject();
    delete newUserObj.password;
    //send response
    res.status(201).json({ message: "User Created", payload: newUserObj });
  } catch (err) {
    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
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
    samesite: "lax",
    secure: false,
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
    sameSite: "lax",
    secure: false,
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
    
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { profileUrl: cloudinaryResult.secure_url },
      { new: true }
    ).select("firstName lastName email profileUrl");

    res.status(200).json({
      message: "Profile photo updated",
      payload: updatedUser
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
