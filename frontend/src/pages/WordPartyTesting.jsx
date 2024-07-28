import { useEffect, useState } from "react";
import io from "socket.io-client";
import fetchText from "../utils/dictionaryutil";

export default function WordPartyTesting() {
  const socket = io.connect("http://localhost:3000");
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [isRoom, setIsRoom] = useState(false);

  // Game states
  const [word, setWord] = useState("");
  const [lives, setLives] = useState(3);
  const [comboList, setComboList] = useState([])
  const [dictionarySet, setDictionarySet] = useState(0)
  const [combo, setCombo] = useState("")
  const [isCorrect, setIsCorrect] = useState(false)



  // Backend -> frontend information transfer
  const [globalUsersInfo, setGlobalUsersInfo] = useState([]);
  const [clientID, setClientID] = useState("");
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(1);
  const [activeUser, setActiveUser] = useState();

  // let usedWords = new Set();

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

  // Starts the timed game events
  const startGameLocal = () => {
    setActiveUser(globalUsersInfo[activeUserIndex].username);
    setCombo(comboList[Math.floor(Math.random() * comboList.length)][0])

    const logController = () => {
      const intervalId = setInterval(() => {
        setActiveUserIndex((prev) => {
          if (prev === 0) {
            return 1;
          } else {
            return (prev + 1) % globalUsersInfo.length || 1;
          }
        });
        setCombo(comboList[Math.floor(Math.random() * comboList.length)][0])
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

  // Uses the emitted server message to start the game
  useEffect(() => {
    if (isActiveGame) {
      startGameLocal();
    }
  }, [isActiveGame]);

  // Gets the list of common sequential combinations
  useEffect(() => {
    async function getDictInfo(){
      let tempInfo = await fetchText()
      setComboList(tempInfo[0])
      setDictionarySet(tempInfo[1])
    }

    getDictInfo()
  }, [])

  // Backend communication
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
    if (globalUsersInfo.length > 0) {
      setActiveUser(globalUsersInfo[activeUserIndex].username);
    }
  }, [activeUserIndex]);

  // Game functions
  const handleWordSubmit = () => {
    if(dictionarySet.has(word.toUpperCase())  && word.toUpperCase().includes(combo)){
      console.log("good job!")
    }
  }

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
          <p>Active user name: {activeUser}</p>
          <p>Lives: {lives}</p>
          <p>Combo: {combo}</p>
          <input onChange={(e) => setWord(e.target.value)}></input>
          <button onClick={handleWordSubmit}>Submit</button>
        </div>
      ) : (
        <p>Game is not active</p>
      )}
    </div>
  );
}
