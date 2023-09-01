import express from "express";
const app = express()


import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import cors from "cors";

//middlewares:
app.use(express.json());   //to send json responses
app.use(cors());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.listen(8800, () => {
    console.log('API Active!');
});