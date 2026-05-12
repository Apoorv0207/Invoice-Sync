import { io } from "socket.io-client";

const socket = io("https://invoice-sync-backend.onrender.com");

export default socket;