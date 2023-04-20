/*
 * Author: Hüseyin Ilıcan
 * Date: 13/06/2022
 * Purpose: Main Screen
 */
import "regenerator-runtime";
import { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  dictionary,
  fillDictionary,
  returnRandomWord,
  returnRandomNameForStart,
} from "./Dictionary";
import "./GameScreen.css";
import names from "../names.json";

const GameScreen = () => {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();

  const [seconds, setSeconds] = useState(8);
  const [wordCount, setWordCount] = useState(0);
  const [lastSpokenWord, setLastSpokenWord] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [turn, setTurn] = useState("");
  const [spokenWords, setSpokenWords] = useState([""]);

  // This is an hook of Web Speech API for speech recognition which I npm'ed
  const { browserSupportsSpeechRecognition, finalTranscript } =
    useSpeechRecognition();

  const listen = () => {
    SpeechRecognition.startListening({
      continuous: false,
      language: "tr-TR",
    });
  };

  // Fill the initial dictionary
  useEffect(() => {
    fillDictionary(dictionary, names);
  }, []);

  // Timer logic with seconds as dependant
  useEffect(() => {
    if (seconds === 0 && turn === "Your Turn") {
      endGame();
    }
  }, [seconds]);

  // The finalTranscript dependent allows useEffect to trigger whenever it recognizes speech from the mic.
  useEffect(() => {
    if (finalTranscript && checkWordValidity(finalTranscript.toLowerCase())) {
      const array: string[] = spokenWords;
      array.push(finalTranscript.toLowerCase());
      setSpokenWords(array);

      setWordCount(wordCount + 1);

      console.log(wordCount);

      cpuTurn();
    } else if (finalTranscript) {
      endGame();
    }
  }, [finalTranscript]);

  //Logic for CPU's turn.
  const cpuTurn = () => {
    setSeconds(8);
    setTurn("AI's Turn");

    if (Math.random() < 0.3) {
      // Random with 30% chance for CPU to lose
      setTimeout(() => {
        playerWon();
      }, 7000);
    } else {
      setTimeout(() => {
        const word = returnRandomWord(
          finalTranscript.toLowerCase().charAt(finalTranscript.length - 1),
          spokenWords
        );
        cpuSpeak(word);
        playerTurn();
      }, (Math.random() + 1) * 2500); // Delay for CPU speaking for a more "realistic/natural" experience
    }
  };

  // Logic for Our turn.
  const playerTurn = () => {
    setSeconds(8);
    listen();
    setTurn("Your Turn");
  };

  // For high score
  const playerWon = () => {
    if (Number(localStorage.getItem("highScore")) < wordCount) {
      localStorage.setItem("highScore", "" + wordCount);
    }
    alert("Oyunu Kazandın! Bilinen İsim Sayısı: " + wordCount);
    window.location.reload();
  };

  // Starting Logic
  const startGame = () => {
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }

    setGameStarted(true);

    listen();

    const gameTime = setInterval(() => {
      setSeconds((seconds) => seconds - 1);
    }, 1000);

    const word = returnRandomNameForStart(dictionary);

    cpuSpeak(word);
    playerTurn();

    return () => {
      clearInterval(gameTime);
    };
  };

  // Logic for word validity checking if it exists in list, if it starts with the right letter and not used previously.
  const checkWordValidity = (word: string) => {
    return (
      dictionary[word.charAt(0)].includes(word) &&
      !spokenWords.includes(word) &&
      word.toLowerCase().charAt(0) ===
        lastSpokenWord.charAt(lastSpokenWord.length - 1)
    );
  };

  // Cpu speak with Utterance, set at Turkish ([0]=tr)
  const cpuSpeak = (word: string) => {
    const utterThis = new SpeechSynthesisUtterance(word);
    utterThis.voice = voices[0];
    console.log(voices);
    synth.speak(utterThis);
    setLastSpokenWord(word);

    const array: string[] = spokenWords;
    array.push(word);
    setSpokenWords(array);
  };

  // End game logic
  const endGame = () => {
    const utterThis = new SpeechSynthesisUtterance("Kolaydı"); // Some banter (Means Easy) :D
    utterThis.voice = voices[0];
    synth.speak(utterThis);
    if (Number(localStorage.getItem("highScore")) < wordCount) {
      localStorage.setItem("highScore", "" + wordCount);
    }
    alert("Oyun Bitti, Kaybettin! Bilinen İsim Sayısı: " + wordCount);
    window.location.reload();
  };

  return (
    <div>
      <div className="center">
        {!gameStarted ? (
          <>
            <button className="button" onClick={startGame}>
              Start Game
            </button>
            <p>High Score: {localStorage.getItem("highScore")} </p>
          </>
        ) : (
          <>
            <p>
              {turn} : {seconds}
            </p>
            <p>Your Word: {finalTranscript} </p>
            <p>AI Word: {lastSpokenWord}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
