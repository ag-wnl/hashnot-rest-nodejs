import express from "express";
const app = express()


import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import authRoutes from "./routes/auth.js"
import messageRoutes from "./routes/messages.js"
import cookieParser from "cookie-parser";
import cors from "cors";

//middlewares:
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(express.json());   //to send json responses
app.use(cors({
    origin: "http://localhost:3000",
}));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.listen(8800, () => {
    console.log('API Active!');
});