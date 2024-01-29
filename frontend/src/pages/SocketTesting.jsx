import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";

export default function SocketHome() {
  const [room, setRoom] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [messageReceived, setMessageReceived] = useState("");
  const [message, setMessage] = useState("");

  const socket = io.connect("http://localhost:3000");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room: room });
      setIsRoom(true);
    }
  };

  const handleSubmit = () => {
    socket.emit("send_message", { message, room: room });
  };

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageReceived(data.message);
  //     alert(data);
  //   });
  // }, [socket]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data);
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
