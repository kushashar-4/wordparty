import { useState } from "react";
import { useEffect } from "react";
import fetchText from "../services/dictionary.services";
import test from "../../public/gamecombos.json";

export default function Game() {
  const [gameCombos, setGameCombos] = useState([]);
  const [randCombo, setRandCombo] = useState("");
  const [dictionarySet, setDictionarySet] = useState(new Set());
  let dictionaryArray = [];

  const [isGame, setIsGame] = useState(false);
  const [wordInput, setWordInput] = useState("");
  const [txt, setTxt] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/gamecombos.json")
        .then((response) => response.json())
        .then((data) => setGameCombos(data))
        .catch((error) => console.log(error));
      // console.log(gameCombos);

      let resp = await fetch("http://localhost:5173/dictionary.txt");
      let final = await resp.text();
      final = final.replaceAll("\r", "");
      dictionaryArray = final.split("\n");
      setDictionarySet(new Set(dictionaryArray));
    };

    fetchData();
  });

  const generateRandomCombo = () => {
    const randNum = Math.floor(Math.random() * 30);
    setRandCombo(gameCombos[randNum][0]);
  };

  const startGame = () => {
    const randNum = Math.floor(Math.random() * 30);
    setRandCombo(gameCombos[randNum][0]);
    setIsGame(true);
  };

  const handleSubmit = () => {
    if (
      dictionarySet.has(wordInput.toUpperCase()) &&
      wordInput.includes(randCombo.toLowerCase())
    ) {
      generateRandomCombo();
      setWordInput("");
    }
  };

  return (
    <div>
      {!isGame && <button onClick={startGame}>Start Game</button>}
      {isGame && (
        <>
          <input
            onChange={(e) => setWordInput(e.target.value)}
            value={wordInput}
          ></input>
          <button onClick={handleSubmit}>Submit Word</button>
          <a>{randCombo}</a>
        </>
      )}
    </div>
  );
}
