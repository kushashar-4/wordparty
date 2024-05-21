import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function WordPartyTesting() {
  const socket = io.connect("http://localhost:3000");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [currentPoints, setCurrentPoints] = useState();
  const [currentWord, setCurrentWord] = useState("");
  let usedWords = new Set();
  let pointAmount = 1;

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      socket.username = username;
      setIsRoom(true);
    } else {
      window.alert("enter both fields");
    }
  };

  const addPoint = () => {
    socket.emit("update_points", { pointAmount, room });
  };

  useEffect(() => {
    socket.on("update_user_info", (data) => {
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
        <>
          <button onClick={addPoint}>Add a point</button>
        </>
      )}
    </div>
  );
}
