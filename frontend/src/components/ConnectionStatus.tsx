import socket from "../socket";
import { useState, useEffect } from "react";

const ConnectionStatus = () => {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div className="connection-status">
      <span className={`status-dot ${connected ? "connected" : "disconnected"}`} />
      {connected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatus;