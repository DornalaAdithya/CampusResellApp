import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstname required"],
      trim: true, //trim the whitespaces before and after the string "   Hello " -> "Hello"
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      match: [/^[^\s@]+@anurag\.edu\.in$/i, "Only anurag.edu.in emails allowed"],
      index: true, //Create a fast lookup structure for this field
    },
    password: {
      type: String,
      minLength: [6, "password should be minimun of length 6"],
      required: [true, "password required"],
      select: false,
    },
    profileUrl: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, strict: "throw", versionKey: false },
);

//Index gives:
// ✔ Faster reads (queries)
// ❌ Slightly slower writes (insert/update)
// ❌ Uses extra memory

//user model
export const UserModel = model("user", userSchema);
