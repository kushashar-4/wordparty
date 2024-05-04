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
  let clientID = socket.id;

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setIsRoom(true);
    } else {
      window.alert("enter both fields");
    }
  };

  const submitWord = () => {
    //Add conditionals here to verify if the word is valid and meets requirements, also add it to a used words set
    if (currentWord !== "") {
      socket.emit("submit_word", { room, clientID });
    }
  };

  useEffect(() => {
    socket.on("get_room_info", (data) => {
      console.log(data);
    });

    socket.on("update_points", (data) => {});
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
          <input placeholder="Enter random word"></input>
          <button
            onClick={submitWord}
            onChange={(e) => setCurrentWord(e.target.value)}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
