import React, { useState, useEffect } from "react";

export default function HandType({ hand, newHandType }) {
  const [handType, setHandType] = useState("None");
  const [cardPoints, setCardPoints] = useState(0);
  const [score, setScore] = useState(0);
  const [mult, setMult] = useState(0);

  const getHandType = () => {
    let sortedHand = [...hand];
    for (let i = 0; i < sortedHand.length; i++) {
      if (sortedHand[i].slice(0, 1) == "A") {
        sortedHand[i] = "14" + sortedHand[i].slice(1, 2);
      } else if (sortedHand[i].slice(0, 1) == "K") {
        sortedHand[i] = "13" + sortedHand[i].slice(1, 2);
      } else if (sortedHand[i].slice(0, 1) == "Q") {
        sortedHand[i] = "12" + sortedHand[i].slice(1, 2);
      } else if (sortedHand[i].slice(0, 1) == "J") {
        sortedHand[i] = "11" + sortedHand[i].slice(1, 2);
      } else if (sortedHand[i].slice(0, 1) == "0") {
        sortedHand[i] = "10" + sortedHand[i].slice(1, 2);
      } else {
        sortedHand[i] = "0" + sortedHand[i];
      }
    }
    sortedHand = sortedHand.sort((a, b) => b.localeCompare(a));
    for (let i = 0; i < sortedHand.length; i++) {
      if (sortedHand[i].slice(0, 2) == "14") {
        sortedHand[i] = "A" + sortedHand[i].slice(2, 3);
      } else if (sortedHand[i].slice(0, 2) == "13") {
        sortedHand[i] = "K" + sortedHand[i].slice(2, 3);
      } else if (sortedHand[i].slice(0, 2) == "12") {
        sortedHand[i] = "Q" + sortedHand[i].slice(2, 3);
      } else if (sortedHand[i].slice(0, 2) == "11") {
        sortedHand[i] = "J" + sortedHand[i].slice(2, 3);
      } else {
        sortedHand[i] = sortedHand[i].slice(1, 3);
      }
    }
    let straight = true;
    let flush = true;
    let sameCards = [[]];
    for (let i = 0; i < sortedHand.length - 1; i++) {
      switch (sortedHand[i].slice(0, 1)) {
        case "A":
          if (
            sortedHand[i + 1].slice(0, 1) !== "K" &&
            sortedHand[i + 1].slice(0, 1) !== "4"
          ) {
            straight = false;
          }
          break;
        case "K":
          if (sortedHand[i + 1].slice(0, 1) !== "Q") {
            straight = false;
          }
          break;
        case "Q":
          if (sortedHand[i + 1].slice(0, 1) !== "J") {
            straight = false;
          }
          break;
        case "J":
          if (sortedHand[i + 1].slice(0, 1) !== "0") {
            straight = false;
          }
          break;
        case "0":
          if (sortedHand[i + 1].slice(0, 1) !== "9") {
            straight = false;
          }
          break;
        default:
          if (
            sortedHand[i + 1].slice(0, 1) !==
            (sortedHand[i].slice(0, 1) - 1).toString()
          ) {
            straight = false;
          }
      }
      if (sortedHand[i].slice(1) !== sortedHand[i + 1].slice(1)) {
        flush = false;
      }
    }
    let j = 0;
    for (let i = 0; i < sortedHand.length; i++) {
      if (
        sameCards[j].length === 0 ||
        sameCards[j][0].slice(0, 1) === sortedHand[i].slice(0, 1)
      ) {
        sameCards[j].push(sortedHand[i].slice(0, 1));
      } else {
        sameCards.push([]);
        j++;
        sameCards[j].push(sortedHand[i].slice(0, 1));
      }
    }
    if (sameCards.length === 1 && flush) {
      setHandType("Flush Five of a Kind");
      setScore(500);
      setMult(25);
    } else if (
      sameCards.length === 2 &&
      sameCards[0].length !== 4 &&
      sameCards[1].length !== 4 &&
      flush
    ) {
      setHandType("Flush Full House");
      setScore(300);
      setMult(20);
    } else if (sameCards.length === 1) {
      setHandType("Five of a Kind");
      setScore(250);
      setMult(15);
    } else if (straight && flush) {
      setHandType("Straight Flush");
      setScore(150);
      setMult(10);
    } else if (sameCards.length === 2) {
      if (sameCards[0].length === 4 || sameCards[1].length === 4) {
        setHandType("Four of a Kind");
        setScore(100);
        setMult(8);
      } else {
        setHandType("Full House");
        setScore(80);
        setMult(6);
      }
    } else if (flush) {
      setHandType("Flush");
      setScore(70);
      setMult(5);
    } else if (straight) {
      setHandType("Straight");
      setScore(60);
      setMult(4);
    } else if (sameCards.length === 3) {
      if (
        sameCards[0].length === 3 ||
        sameCards[1].length === 3 ||
        sameCards[2].length === 3
      ) {
        setHandType("Three of a Kind");
        setScore(50);
        setMult(3);
      } else {
        setHandType("Two Pair");
        setScore(30);
        setMult(3);
      }
    } else if (sameCards.length === 4) {
      setHandType("One Pair");
      setScore(20);
      setMult(2);
    } else {
      setHandType("High Card");
      setScore(0);
      setMult(1);
    }
    let cardPoints = 0;
    for (let i = 0; i < sortedHand.length; i++) {
      switch (sortedHand[i].slice(0, 1)) {
        case "A":
          cardPoints += 14;
          break;
        case "K":
          cardPoints += 13;
          break;
        case "Q":
          cardPoints += 12;
          break;
        case "J":
          cardPoints += 11;
          break;
        case "0":
          cardPoints += 10;
          break;
        default:
          cardPoints += parseInt(sortedHand[i].slice(0, 1));
      }
    }
    setCardPoints(cardPoints);
  };

  useEffect(() => {
    getHandType();
  });

  return (
    <div className="flex justify-between m-2">
      <button
        onClick={() => {
          newHandType((cardPoints + score) * mult);
        }}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Play Hand
      </button>
      <p>HandType: {handType}</p>
      <p>(Card Points: {cardPoints}</p>
      <p>+</p>
      <p>Score: {score})</p>
      <p>*</p>
      <p>Multiplier: {mult}</p>
      <p>=</p>
      <p>Final: {(cardPoints + score) * mult}</p>
    </div>
  );
}
