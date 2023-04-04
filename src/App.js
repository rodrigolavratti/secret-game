//React
import{ useCallback, useEffect, useState } from 'react';

//importação dos dados
import {wordsList} from './data/words';

//Css
import './App.css';

//Css dos componentes
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);  
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    //console.log(category);

    // pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]
    //console.log(word);

    return {word, category};
  }, [words]);

  // Start the secret word game
  const startGame = useCallback(() => {
    // clear all letters
    clearLettersStates();
    // pick word and pick category
    const {word, category} = pickWordAndCategory();
    // pegar uma palavra e transformar em letras | create an array of letter
    let wordLetters = word.split("");
    // o retorno das letras no wordLetter, retorna a 1° em maiúsculo, e precisamos deixar todas as letras minúsculas
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //console.log(word, category);
    //console.log(wordLetters);

    // fill states | setar os status
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    // checando se a letra já foi utilizada
    if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }
    // incluir as letras que o usuário adivinha para as letras acertivas ou erradas
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  }

  const clearLettersStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // verifica se as tentativas terminaram
  useEffect(() => {
    if(guesses <= 0) {
      //reset all states
      clearLettersStates();

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //verifica a condição de vitória
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    // win condition
    if(guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => actualScore += 100);
      //restartar game with new word
      startGame();
    }
    
  }, [guessedLetters, letters, startGame])

  // restarts the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame}/>}
      {gameStage === "game" && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && (
        <GameOver 
          retry={retry}
          score={score}
        />
      )}
    </div>
  );
}

export default App;
