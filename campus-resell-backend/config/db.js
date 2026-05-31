import { connect } from "mongoose";

export async function connectDB() {
  try {
    await connect(process.env.DB_URL);
    console.log("----DataBase connection Successful---");
  } catch (err) {
    console.log("***Error in connecting DataBase***", err);
    process.exit(1);
  }
}
