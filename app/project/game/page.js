"use client";

import Card from "./card";
import HandType from "./handType";
import Link from "next/link";

import { useState } from "react";
import { useUserAuth } from "./../_utils/auth-context";

import { addItem } from "../_services/score-services";

export default function Home() {
  const { user } = useUserAuth();

  const [gameState, setGameState] = useState("Home");
  const [deck, setDeck] = useState([
    "AS",
    "2S",
    "3S",
    "4S",
    "5S",
    "6S",
    "7S",
    "8S",
    "9S",
    "0S",
    "JS",
    "QS",
    "KS",
    "AH",
    "2H",
    "3H",
    "4H",
    "5H",
    "6H",
    "7H",
    "8H",
    "9H",
    "0H",
    "JH",
    "QH",
    "KH",
    "AD",
    "2D",
    "3D",
    "4D",
    "5D",
    "6D",
    "7D",
    "8D",
    "9D",
    "0D",
    "JD",
    "QD",
    "KD",
    "AC",
    "2C",
    "3C",
    "4C",
    "5C",
    "6C",
    "7C",
    "8C",
    "9C",
    "0C",
    "JC",
    "QC",
    "KC",
  ]);
  const [deckID, setDeckID] = useState("None");
  const [cardsRemaining, setCardsRemaining] = useState(deck.length);
  const [hand, setHand] = useState([]);
  const [handSize, setHandSize] = useState(8);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selected, setSelected] = useState([
    "U",
    "U",
    "U",
    "U",
    "U",
    "U",
    "U",
    "U",
  ]);
  const [currentScore, setCurrentScore] = useState(0);
  const [targetScore, setTargetScore] = useState(500);
  const [handsLeft, setHandsLeft] = useState(3);
  const [discards, setDiscards] = useState(3);
  const [discardsLeft, setDiscardsLeft] = useState(3);
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);
  const [rewardList, setRewardList] = useState([]);
  const [doubleCard, setDoubleCard] = useState("");
  const [removeSuit, setRemoveSuit] = useState("");
  const [removeSuitDisplay, setRemoveSuitDisplay] = useState("");
  const [removeRank, setRemoveRank] = useState("");
  const [removeRankDisplay, setRemoveRankDisplay] = useState("");
  const [doubleSuit, setDoubleSuit] = useState("");
  const [doubleSuitDisplay, setDoubleSuitDisplay] = useState("");
  const [doubleRank, setDoubleRank] = useState("");
  const [doubleRankDisplay, setDoubleRankDisplay] = useState("");

  const newGame = () => {
    setGameState("Round Start");
    getDeckID();
  };

  const newRound = () => {
    setGameState("Play");
    setHandsLeft(3);
    setDiscardsLeft(discards);
    setCurrentScore(0);
    drawHand([]);
  };

  const getDeckID = async () => {
    const response = await fetch(
      `https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${deck.join(",")}`
    );
    const data = await response.json();
    setDeckID(data.deck_id);
  };

  const drawHand = async (hand) => {
    let newCards = [];
    for (let i = hand.length; i < handSize; i++) {
      const response = await fetch(
        `https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=1`
      );
      const data = await response.json();
      newCards.push(data.cards[0].code);
      setCardsRemaining(data.remaining);
    }
    newCards = [...hand, ...newCards];
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].slice(0, 1) == "A") {
        newCards[i] = "14" + newCards[i].slice(1, 2);
      } else if (newCards[i].slice(0, 1) == "K") {
        newCards[i] = "13" + newCards[i].slice(1, 2);
      } else if (newCards[i].slice(0, 1) == "Q") {
        newCards[i] = "12" + newCards[i].slice(1, 2);
      } else if (newCards[i].slice(0, 1) == "J") {
        newCards[i] = "11" + newCards[i].slice(1, 2);
      } else if (newCards[i].slice(0, 1) == "0") {
        newCards[i] = "10" + newCards[i].slice(1, 2);
      } else {
        newCards[i] = "0" + newCards[i];
      }
    }
    newCards = newCards.sort((a, b) => b.localeCompare(a));
    for (let i = 0; i < newCards.length; i++) {
      if (newCards[i].slice(0, 2) == "14") {
        newCards[i] = "A" + newCards[i].slice(2, 3);
      } else if (newCards[i].slice(0, 2) == "13") {
        newCards[i] = "K" + newCards[i].slice(2, 3);
      } else if (newCards[i].slice(0, 2) == "12") {
        newCards[i] = "Q" + newCards[i].slice(2, 3);
      } else if (newCards[i].slice(0, 2) == "11") {
        newCards[i] = "J" + newCards[i].slice(2, 3);
      } else {
        newCards[i] = newCards[i].slice(1, 3);
      }
    }
    setHand(newCards);
  };

  const selectCard = (card, state, index) => {
    if (state === "U") {
      setSelectedCards([...selectedCards, card]);
      selected[index] = "S";
    } else {
      let newSelected = [];
      let removed = false;
      for (let i = 0; i < selectedCards.length; i++) {
        if (selectedCards[i] === card && !removed) {
          removed = true;
        } else {
          newSelected.push(selectedCards[i]);
        }
      }
      setSelectedCards(newSelected);
      selected[index] = "U";
    }
  };

  const discardCards = () => {
    if (discardsLeft == 0) {
      alert("No discards left!");
      return;
    } else if (selectedCards.length > 5) {
      alert("Only 5 cards can be discarded at a time!");
      return;
    } else if (selectedCards.length == 0) {
      alert("No cards selected!");
      return;
    } else {
      setDiscardsLeft(discardsLeft - 1);
      removeCards();
    }
  };

  const removeCards = () => {
    let newCards = [];
    for (let i = 0; i < hand.length; i++) {
      if (selected[i] === "U") {
        newCards.push(hand[i]);
      }
    }
    setHand(newCards);
    setSelected(["U", "U", "U", "U", "U", "U", "U", "U"]);
    setSelectedCards([]);
    drawHand(newCards);
  };

  const scoring = (score) => {
    let newScore = score + currentScore;
    setCurrentScore(newScore);
    let newTotalScore = score + totalScore;
    setTotalScore(newTotalScore);
    if (handsLeft == 1) {
      if (newScore >= targetScore) {
        setRound(round + 1);
        setTargetScore(targetScore * 1.5);
        let newRewardList = [];
        for (let i = 0; i < 3; i++) {
          let newReward;
          while (true) {
            newReward = Math.floor(Math.random() * 7);
            if (!newRewardList.includes(newReward)) {
              newRewardList.push(newReward);
              break;
            }
          }
          setRewardList(newRewardList);
          if (newReward == 0) {
            let randomCard = Math.floor(Math.random() * deck.length);
            setDoubleCard(deck[randomCard]);
          }
          if (newReward == 1) {
            let randomRank = Math.floor(1 + Math.random() * 13);
            if (randomRank == 1) {
              setRemoveRank("A");
              setRemoveRankDisplay("Ace");
            } else if (randomRank == 10) {
              setRemoveRank("0");
              setRemoveRankDisplay("10");
            } else if (randomRank == 11) {
              setRemoveRank("J");
              setRemoveRankDisplay("Jack");
            } else if (randomRank == 12) {
              setRemoveRank("Q");
              setRemoveRankDisplay("Queen");
            } else if (randomRank == 13) {
              setRemoveRank("K");
              setRemoveRankDisplay("King");
            } else {
              setRemoveRank(randomRank);
              setRemoveRankDisplay(randomRank);
            }
          }
          if (newReward == 2) {
            let randomSuit = Math.floor(Math.random() * 4);
            if (randomSuit == 0) {
              setRemoveSuit("S");
              setRemoveSuitDisplay("Spades");
            } else if (randomSuit == 1) {
              setRemoveSuit("H");
              setRemoveSuitDisplay("Hearts");
            } else if (randomSuit == 2) {
              setRemoveSuit("D");
              setRemoveSuitDisplay("Diamonds");
            } else if (randomSuit == 3) {
              setRemoveSuit("C");
              setRemoveSuitDisplay("Clubs");
            }
          }
          if (newReward == 3) {
            let randomRank = Math.floor(1 + Math.random() * 13);
            if (randomRank == 1) {
              setDoubleRank("A");
              setDoubleRankDisplay("Ace");
            } else if (randomRank == 10) {
              setDoubleRank("0");
              setDoubleRankDisplay("10");
            } else if (randomRank == 11) {
              setDoubleRank("J");
              setDoubleRankDisplay("Jack");
            } else if (randomRank == 12) {
              setDoubleRank("Q");
              setDoubleRankDisplay("Queen");
            } else if (randomRank == 13) {
              setDoubleRank("K");
              setDoubleRankDisplay("King");
            } else {
              setDoubleRank(randomRank);
              setDoubleRankDisplay(randomRank);
            }
          }
          if (newReward == 4) {
            let randomSuit = Math.floor(Math.random() * 4);
            if (randomSuit == 0) {
              setDoubleSuit("S");
              setDoubleSuitDisplay("Spades");
            } else if (randomSuit == 1) {
              setDoubleSuit("H");
              setDoubleSuitDisplay("Hearts");
            } else if (randomSuit == 2) {
              setDoubleSuit("D");
              setDoubleSuitDisplay("Diamonds");
            } else if (randomSuit == 3) {
              setDoubleSuit("C");
              setDoubleSuitDisplay("Clubs");
            }
          }
        }
        setGameState("Reward");
      } else {
        addItem(user.uid, newTotalScore);
        setGameState("Game Over");
      }
    } else {
      setHandsLeft(handsLeft - 1);
    }
    removeCards();
  };

  const reward = (option) => {
    let newDeck = [];
    switch (option) {
      case 0:
        // add 2
        newDeck = [...deck, doubleCard, doubleCard];
        setDeck(newDeck);
        break;
      case 1:
        // remove all rank
        newDeck = deck.filter((card) => card.slice(0, 1) != removeRank);
        setDeck(newDeck);
        break;
      case 2:
        // remove all suit
        newDeck = deck.filter((card) => card.slice(1, 2) != removeSuit);
        setDeck(newDeck);
        break;
      case 3:
        // double all rank
        newDeck = [...deck];
        for (let i = 0; i < deck.length; i++) {
          if (deck[i].slice(0, 1) == doubleRank) {
            newDeck.push(deck[i]);
          }
        }
        setDeck(newDeck);
        break;
      case 4:
        // double all suit
        newDeck = [...deck];
        for (let i = 0; i < deck.length; i++) {
          if (deck[i].slice(1, 2) == doubleSuit) {
            newDeck.push(deck[i]);
          }
        }
        setDeck(newDeck);
        break;
      case 5:
        // add 1 discard
        setDiscards(discards + 1);
        break;
      case 6:
        // add 1 handsize
        setHandSize(handSize + 1);
        break;
    }
    setRewardList([]);
  };

  const updateDeck = () => {
    getDeckID();
    setGameState("Round Start");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      <div>
        {gameState === "Home" && (
          <button
            onClick={() => {
              newGame();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Play
          </button>
        )}
        {gameState === "Round Start" && (
          <button
            onClick={() => {
              newRound();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Round {round}
          </button>
        )}
        {gameState === "Play" && (
          <div>
            <div className="flex justify-between m-2">
              <p>Round: {round}</p>
              <p>Target Score: {targetScore}</p>
              <p>Score: {currentScore}</p>
              <p>Total Score: {totalScore}</p>
            </div>
            {selectedCards.length == 5 && (
              <HandType hand={selectedCards} newHandType={scoring} />
            )}
            {selectedCards.length == 5 && <p>test</p>}
            <div className="flex justify-between m-2">
              {hand.map((card, index) => (
                <ul key={index}>
                  <li>
                    <Card
                      name={card}
                      image={`https://deckofcardsapi.com/static/img/${card}.png`}
                      onSelect={selectCard}
                      state={selected[index]}
                      index={index}
                    />
                  </li>
                </ul>
              ))}
              <div className={"mx-5"}>
                <img
                  className={"mt-20"}
                  src={`https://deckofcardsapi.com/static/img/back.png`}
                  alt={`Back Card`}
                />
                <p>Cards left: {cardsRemaining}</p>
              </div>
            </div>
            <div className="flex justify-end m-2">
              <button
                onClick={() => {
                  discardCards();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Discard
              </button>
            </div>
            <div className="flex justify-between m-2">
              <p>Hands Left: {handsLeft}</p>
              <p>Discards Left: {discardsLeft}</p>
            </div>
          </div>
        )}
        {gameState === "Reward" && (
          <div className="flex justify-center m-2">
            <p className="text-xl">Choose 1</p>
          </div>
        )}
        <div className="flex justify-between m-2">
          {gameState === "Reward" && rewardList.includes(0) && (
            <div className="flex-col">
              <Card
                name={doubleCard}
                image={`https://deckofcardsapi.com/static/img/${doubleCard}.png`}
              />
              <button
                onClick={() => {
                  reward(0);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add 2 Copies of this card
              </button>
            </div>
          )}
          {gameState === "Reward" && rewardList.includes(1) && (
            <div className="flex-col">
              <button
                onClick={() => {
                  reward(1);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Remove all cards of the rank {removeRankDisplay}
              </button>
            </div>
          )}
          {gameState === "Reward" && rewardList.includes(2) && (
            <div className="flex-col">
              <button
                onClick={() => {
                  reward(2);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Remove all cards of the suit {removeSuitDisplay}
              </button>
            </div>
          )}
          {gameState === "Reward" && rewardList.includes(3) && (
            <div className="flex-col">
              <button
                onClick={() => {
                  reward(3);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add a copy of all cards of the rank {doubleRankDisplay}
              </button>
            </div>
          )}
          {gameState === "Reward" && rewardList.includes(4) && (
            <div className="flex-col">
              <button
                onClick={() => {
                  reward(4);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add a copy of all cards of the suit {doubleSuitDisplay}
              </button>
            </div>
          )}
          {gameState === "Reward" && rewardList.includes(5) && (
            <button
              onClick={() => {
                reward(5);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add 1 discard per round
            </button>
          )}
          {gameState === "Reward" && rewardList.includes(6) && (
            <button
              onClick={() => {
                reward(6);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add 1 handsize
            </button>
          )}
          {gameState === "Reward" && rewardList.length == 0 && (
            <button
              onClick={() => {
                updateDeck();
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              updateDeck
            </button>
          )}
        </div>
        {gameState === "Game Over" && (
          <div>
            <p className="text-lg">Game Over!</p>
            <p className="text-lg">Total Score: {totalScore}</p>
            <p className="text-lg">
              <Link className="hover:underline cursor-pointer" href="/project">
                Back to Home
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
