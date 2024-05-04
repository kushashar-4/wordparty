import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function SocketHome() {
  const [room, setRoom] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const socket = io.connect("http://localhost:3000");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room });
      setIsRoom(true);
    }
  };

  const handleSubmit = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("get_message", (data) => {
      // Use functional update to correctly update state based on previous state
      setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
    });
  }, [socket]);

  return (
    <div>
      {!isRoom ? (
        <>
          <input
            placeholder="Room Name"
            onChange={(e) => setRoom(e.target.value)}
          ></input>
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <div>
          <input
            placeholder="Message..."
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={handleSubmit}>Send</button>
          <h1>Message:</h1>
          {receivedMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
