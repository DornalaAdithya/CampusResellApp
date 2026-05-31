import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { UserModel } from "../models/UserModel.js";

config();

export const authenticate = (...allowedRoles) => {
  return async (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
      throw {
        status: 401,
        message: "Unauthorized Req. Please Login",
      };
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      //jwt.verify throws error if token is invalid/expired
      if (err.name === "TokenExpiredError") {
        throw {
          status: 401,
          message: "Session expired. please login",
        };
      }
      if (err.name === "JsonWebTokenError") {
        throw {
          status: 401,
          message: "Invalid token. please login",
        };
      }
      throw {
        status: 401,
        message: "Invalid or expired token",
      };
    }

    // role-based access control (RBAC)
    if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
      throw {
        status: 403,
        message: "Access denied",
      };
    }

    //check if user still active(not blocked by the admin)
    // const user = await UserModel.findById(decodedToken.userId);
    // // console.log(user);
    // if (!user || !user.isActive) {
    //   throw {
    //     status: 403,
    //     message: "User account is blocked",
    //   };
    // }

    //Attach user info to req for use in routes
    req.user = decodedToken;

    //forward the req to next middleware/route
    next();
  };
};

export const optionalAuthenticate = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
  } catch (err) {
    // ignore token errors for optional auth
  }

  next();
};
