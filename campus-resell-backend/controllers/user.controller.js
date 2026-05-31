import { UserModel } from "../models/UserModel.js";

export const getUsers = async (req, res) => {
  const users = await UserModel.find();
  res.status(200).json({ message: "All Users", payload: users });
};
