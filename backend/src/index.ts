import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./db";
import createInvoiceRouter from "./invoice.routes";

const app = express();
const httpServer = http.createServer(app);

// Socket.io server attached to the same HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Vite default port
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes — pass io into routes so POST can emit events
app.use("/api/invoices", createInvoiceRouter(io));

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server after DB connects
const PORT = process.env.PORT ?? 5000;

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});