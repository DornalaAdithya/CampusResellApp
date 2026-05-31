import { config } from "dotenv";
import exp from "express";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import productRoute from "./routes/product.route.js";
import chatRoute from "./routes/chatRoutes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

//.env - used to access the environment variable's
config();

//create app-server (imported from socket.js)

//cors
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

//body parsing middleware
app.use(exp.json());
//cookie parser middleware
app.use(cookieParser());

//connect DataBase
connectDB();

//routes
app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/products", productRoute);
app.use("/api/chat", chatRoute);

//start the http server
const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`server started, app listening to port ${port}`));

//invalid path
app.use((req, res, next) => {
  res.status(404).json({ message: `${req.url} is invalid path` });
});

//error handling middleware
app.use(errorHandler);
