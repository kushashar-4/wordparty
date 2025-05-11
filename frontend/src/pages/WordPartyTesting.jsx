import { useEffect, useState, useRef } from "react";
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


  // Backend -> frontend information transfer
  const [globalUsersInfo, setGlobalUsersInfo] = useState([]);
  const [clientID, setClientID] = useState("");
  const [isActiveGame, setIsActiveGame] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(1);
  const [activeUser, setActiveUser] = useState();

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setIsRoom(true);
    } else {
      window.alert("enter both fields");
    }
  };

  const startGameForAllUsers = () => {
    socket.emit("start_game", { clientID, room });
    socket.emit("advance_game_server", {room, clientID, isCorrect : true, lives, len : globalUsersInfo.length, activeUserIndex, comboList})
  };

  const advanceUser = () => {
    if(globalUsersInfo[activeUserIndex].clientID == clientID) {
      socket.emit("advance_game_server", {room, clientID, isCorrect : true, lives, len : globalUsersInfo.length, activeUserIndex, comboList});
    }
  }

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
      setUserLives(data);
      setIsActiveGame(data[0].isActiveGame)
    });

    async function setUserLives(data) {
      for (let i = 1; i < data.length; i++) {
        if (data[i].username == username) {
          if(data[i].lives == 0) {
            window.alert(username + " lost")
          }
          setLives(data[i].lives);
        }
      }
    }

    socket.on("update_client_id", (data) => {
      setClientID(data);
    });

    socket.on("update_combo", (data) => {
      setCombo(data);
    })

    socket.on("update_active_user_index", (data) => {
      setActiveUserIndex(data);
    })
  }, [socket]);

  useEffect(() => {
    if (globalUsersInfo.length > 0) {
      setActiveUser(globalUsersInfo[activeUserIndex].username);
    }
  }, [activeUserIndex]);

  // Game functions
  const handleWordSubmit = () => {
    if(dictionarySet.has(word.toUpperCase())  && word.toUpperCase().includes(combo)){
      advanceUser();
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
          <button onClick={startGameForAllUsers}>Start</button>
        </>
      )}
      {isActiveGame ? (
        <div>
          <p>Game is active</p>
          <p>Your user name: {username}</p>
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
