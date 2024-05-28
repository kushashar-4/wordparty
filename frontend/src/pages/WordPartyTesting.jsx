import { useEffect, useState } from "react";
import io from "socket.io-client";

export default function WordPartyTesting() {
  const socket = io.connect("http://localhost:3000");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [isRoom, setIsRoom] = useState(false);
  const [word, setWord] = useState("");
  const [lives, setLives] = useState(3);
  const [globalUsersInfo, setGlobalUsersInfo] = useState([]);
  const [clientID, setClientID] = useState("");
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  let usedWords = new Set();

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setIsRoom(true);
    } else {
      window.alert("enter both fields");
    }
  };

  const addPoint = () => {
    socket.emit("update_points", { pointAmount, room, clientID });
  };

  const startGame = () => {
    activeUserIndex == globalUsersInfo.length
      ? setActiveUserIndex(0)
      : setActiveUserIndex(activeUserIndex + 1);
    console.log(activeUserIndex);
    const logController = () => {
      const intervalId = setInterval(() => {
        activeUserIndex == globalUsersInfo.length
          ? setActiveUserIndex(0)
          : setActiveUserIndex(activeUserIndex + 1);
        console.log(activeUserIndex);
      }, 5000);
      return intervalId;
    };

    const timeController = () => {
      const intervalId = logController();
      setTimeout(() => {
        console.log("game has ended");
        clearInterval(intervalId);
      }, 60000);
    };

    timeController();
  };

  useEffect(() => {
    socket.on("update_user_info", (data) => {
      console.log(data);
      setGlobalUsersInfo(data);
      for (let i = 0; i < globalUsersInfo.length; i++) {
        if (globalUsersInfo[i].clientID == clientID) {
          setLives(globalUsersInfo[i].lives);
        }
      }
    });

    socket.on("update_client_id", (data) => {
      setClientID(data);
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
          <button onClick={startGame}>Start</button>
        </>
      )}
    </div>
  );
}
