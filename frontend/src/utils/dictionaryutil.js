export default async function fetchText() {
  let dictionaryArray = [];
  let dictionarySet;
  let comboSet = new Set();
  let gameCombos = [];

  // Fetches dictionary -> transfers to set
  let resp = await fetch("http://localhost:5173/dictionary.txt");
  let final = await resp.text();
  final = final.replaceAll("\r", "");
  dictionaryArray = final.split("\n");
  dictionarySet = new Set(dictionaryArray);

  const repeatedMap = new Map();

  calculateCombos(dictionaryArray);

  // Creates a dictionary of all possible 3 letter sequential combos in the english dictionary
  function calculateCombos(dictionaryArray) {
    //for loop logic populates a dictionary to keep track of the most common combinations.
    for (let i = 0; i < dictionaryArray.length; i++) {
      for (let j = 0; j < dictionaryArray[i].length - 2; j++) {
        let temp =
          dictionaryArray[i][j] +
          dictionaryArray[i][j + 1] +
          dictionaryArray[i][j + 2];
        if (comboSet.has(temp)) {
          if (repeatedMap.has(temp)) {
            repeatedMap.set(temp, repeatedMap.get(temp) + 1);
          } else {
            repeatedMap.set(temp, 0);
          }
        } else {
          comboSet.add(temp);
        }
      }
    }
  }

  // Creates an array from the map and sorts it from greatest to least repititions
  let arrayFromMap = Array.from(repeatedMap);
  arrayFromMap.sort((a, b) => b[1] - a[1]);

  for (let i = 0; i < 30; i++) {
    gameCombos.push(arrayFromMap[i]);
  }

  return [gameCombos, dictionarySet];
}
