"use client";

import Link from "next/link";
import { useUserAuth } from "./_utils/auth-context";

export default function Page() {
  const { user, gitHubSignIn, firebaseSignOut } = useUserAuth();

  const handleSignIn = async () => {
    await gitHubSignIn();
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
  };

  return (
    <main>
      <h1 className="text-4xl font-bold mb-5">Shopping List App</h1>
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
          <Link className="hover:underline cursor-pointer" href="/project/game">
            Continue to Game
          </Link>
        </p>
      )}
    </main>
  );
}
