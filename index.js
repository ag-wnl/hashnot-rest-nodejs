import express from "express";
import { WebSocketServer } from 'ws';
import http from "http";

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

const app = express();

//middlewares:
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

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');

  // Handle messages from clients
  ws.on('message', (message) => {
    console.log(`Received WebSocket message: ${message}`);
  });
});

// Attach WebSocket server to the HTTP server
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

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

server.listen(8800, () => {
  console.log("API Active!");
});
