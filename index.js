import express from "express";

import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/messages.js";
import upvoteRoutes from "./routes/upvotes.js";
import relationRoutes from "./routes/relations.js";
import searchRoutes from "./routes/search.js";
import LinkPreviews from "./routes/linkprev.js"
import hackathonRoutes from "./routes/hackathonFinder.js"
import showRequestRoutes from "./routes/showRequest.js"
import chatRoutes from "./routes/chat.js"
import skillRoutes from "./routes/skill.js"

import cookieParser from "cookie-parser";   
import cors from "cors";
import credentials from "./serviceAccountKey.json"  assert { type: "json" };
import { initializeApp } from 'firebase-admin/app';
import admin from "firebase-admin";


const app = express();
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

//middlewares, CORS stuff:
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json()); //to send json responses

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upvotes", upvoteRoutes);
app.use("/api/relations", relationRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/urlprev", LinkPreviews);
app.use("/api/hackathon", hackathonRoutes);
app.use("/api/showrequest", showRequestRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/skills", skillRoutes);

const SERVER_PORT = 8800;

app.listen(SERVER_PORT, () => {
  console.log(`API Active on Port : ${SERVER_PORT}`);
});

