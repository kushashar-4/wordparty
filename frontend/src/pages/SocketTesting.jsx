import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function SocketHome() {
  const [room, setRoom] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const socket = io.connect("http://localhost:3000");

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setIsRoom(true);
    } else {
      window.alert("fill out both fields");
    }
  };

  const handleSend = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("get_message", (data) => {
      setReceivedMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("get_room_info", (data) => {
      console.log(data);
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
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <div>
          <input
            placeholder="Message..."
            onChange={(e) => setMessage(e.target.value)}
          ></input>
          <button onClick={handleSend}>Send</button>
          <h1>Message:</h1>
          {receivedMessages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
    </div>
  );
}
