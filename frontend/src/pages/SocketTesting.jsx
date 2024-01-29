import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

export default function SocketHome() {
  const [room, setRoom] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [messageReceived, setMessageReceived] = useState("");
  const [message, setMessage] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setIsRoom(true);
    }
  };

  const handleSubmit = () => {
    socket.emit("send_message", { message, room: room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div>
      {!isRoom ? (
        <>
          {" "}
          <input
            placeholder="Room Name"
            onChange={(e) => setRoom(e.target.value)}
          ></input>
          <button onClick={joinRoom}>Create Room</button>
        </>
      ) : (
        <div>
          <input
            placeholder="Message..."
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          ></input>
          <button onClick={handleSubmit}>Send</button>
          <h1>Message:</h1>
          <p>{messageReceived}</p>
        </div>
      )}
    </div>
  );
}
