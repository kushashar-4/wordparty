import { set } from "lodash";
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
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(1);
  const [activeUser, setActiveUser] = useState();
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

  const startGameForAllUsers = () => {
    socket.emit("start_game", { clientID, room });
  };

  const startGameLocal = () => {
    setActiveUser(globalUsersInfo[activeUserIndex].username);
    const logController = () => {
      const intervalId = setInterval(() => {
        setActiveUserIndex((prev) => {
          if (prev === 0) {
            return 1;
          } else {
            return (prev + 1) % globalUsersInfo.length || 1;
          }
        });
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
      setGlobalUsersInfo(data);
      for (let i = 0; i < globalUsersInfo.length; i++) {
        if (globalUsersInfo[i].clientID == clientID) {
          setLives(globalUsersInfo[i].lives);
        }
      }
      if (data[0].isActiveGame) {
        setIsActiveGame(!isActiveGame);
      }
    });

    socket.on("update_client_id", (data) => {
      setClientID(data);
    });
  }, [socket]);

  useEffect(() => {
    if (isActiveGame) {
      startGameLocal();
    }
  }, [isActiveGame]);

  useEffect(() => {
    if (globalUsersInfo.length > 0) {
      setActiveUser(globalUsersInfo[activeUserIndex].username);
    }
  }, [activeUserIndex]);

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
          <button onClick={startGameForAllUsers}>Start</button>
        </>
      )}
      {isActiveGame ? (
        <div>
          <p>Game is active</p>
          <p>Active user index: {activeUserIndex}</p>
          <p>Active user name: {activeUser}</p>
        </div>
      ) : (
        <p>Game is not active</p>
      )}
    </div>
  );
}
