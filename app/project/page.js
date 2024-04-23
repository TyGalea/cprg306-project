"use client";

import Link from "next/link";
import { useUserAuth } from "./_utils/auth-context";
import { useState } from "react";

import { getItems } from "./_services/score-services";

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  const [pageState, setPageState] = useState("home");
  const [highScores, setHighScores] = useState([]);

  const handleSignIn = async () => {
    await gitHubSignIn();
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
  };

  const handleHighScore = async () => {
    let scores = await getItems(user.uid);
    setHighScores(scores);
    setPageState("high-scores");
  };

  return (
    <main>
      {pageState === "home" && (
        <div>
          <h1 className="text-4xl font-bold mb-5">Tyler's cool card game</h1>
          {user && (
            <p className="text-lg">
              Signed in as {user.displayName} ({user.email}).
            </p>
          )}
          {user ? (
            <button
              className="text-lg hover:underline"
              onClick={() => handleSignOut()}
            >
              Sign out
            </button>
          ) : (
            <button
              className="text-lg hover:underline"
              onClick={() => handleSignIn()}
            >
              Sign in with GitHub
            </button>
          )}
          {user && (
            <p className="text-lg">
              <Link
                className="hover:underline cursor-pointer"
                href="/project/game"
              >
                Continue to Game
              </Link>
            </p>
          )}
          <p></p>
          <button
            onClick={() => setPageState("rules")}
            className="text-lg hover:underline"
          >
            Rules
          </button>
          <p></p>
          <button
            onClick={() => handleHighScore()}
            className="text-lg hover:underline"
          >
            High Scores
          </button>
        </div>
      )}
      {pageState === "rules" && (
        <div>
          <h1 className="text-4xl font-bold mb-5">Rules</h1>
          <p>
            In this game you play poker hands from your hand cards to score
            points.
          </p>
          <p>The better the hand the higher the score.</p>
          <p>Each card played also scores points based on its rank.</p>
          <p>Each round you will draw a hand of 8 cards.</p>
          <p>
            You will get to play 3 hands of 5 card to meet the target score.
          </p>
          <p>You can also discard upto 5 cards 3 times each round.</p>
          <p>If you fail to meet the target score it is game over!</p>
          <p>
            If you pass the target score you will get to choose an upgrade such
            as
          </p>
          <p>
            Modifying the cards in your deck or increasing the amount of
            discards per round
          </p>
          <p>You will then start another round with a higher target score</p>
          <p>You will keep going until you fail a round</p>
          <p>Good luck!</p>

          <button
            onClick={() => setPageState("home")}
            className="text-lg hover:underline"
          >
            Back To Home
          </button>
        </div>
      )}
      {pageState === "high-scores" && (
        <div>
          <h1 className="text-4xl font-bold mb-5">High Scores</h1>
          {highScores.map((score, index) => (
            <ul key={index}>
              <li>
                {index + 1}. {score.score}
              </li>
            </ul>
          ))}
          <button
            onClick={() => setPageState("home")}
            className="text-lg hover:underline"
          >
            Back
          </button>
        </div>
      )}
    </main>
  );
}
