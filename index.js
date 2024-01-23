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
import cookieParser from "cookie-parser";   
import cors from "cors";

import http from "http";
import { WebSocketServer } from "ws"; 

const app = express();
const server = http.createServer(app);
const wss =  new WebSocketServer({ server });

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

wss.on("headers", (headers, req) => {
  cors()(req, null, () => {
    headers.push("Access-Control-Allow-Credentials: true");
    headers.push("Access-Control-Allow-Origin: http://localhost:3000");
  })
})

wss.on("connection", (ws) => {
  console.log("someone connected");

  ws.on("message", (message) => {
    console.log("recieved: ", message);
    ws.send(`Hi, here you go: ${message}`);
  });

  ws.on("close", () => {
    console.log("connection closed"); 
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

app.listen(8800, () => {
  console.log("API Active!");
});

const serverPort = 6565;
server.listen(serverPort, () => {
  console.log(`Web socket listening on port: ${serverPort}`);
})
