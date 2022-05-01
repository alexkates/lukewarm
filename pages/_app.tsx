import "../styles/globals.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "../src/supabase";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(event, session);
        if (event === "SIGNED_IN") {
          setAuthenticated(true);
          router.push("/dashboard");
        }
        if (event === "SIGNED_OUT") {
          setAuthenticated(false);
          router.push("/");
        }
      }
    );
    const user = supabase.auth.user();
    if (user) {
      setAuthenticated(true);
    }

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  async function handleAuthChange(
    event: AuthChangeEvent,
    session: Session | null
  ) {
    await fetch("/api/auth", {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      credentials: "same-origin",
      body: JSON.stringify({ event, session }),
    });
  }
  return (
    <div>
      <nav>
        <Link href="/">
          <a>Home</a>
        </Link>
        {!authenticated && (
          <Link href="/sign-in">
            <a>Sign In</a>
          </Link>
        )}
        {authenticated && (
          <Link href="/dashboard">
            <a>Dashboard</a>
          </Link>
        )}
        {authenticated && (
          <a
            onClick={() => {
              supabase.auth.signOut();
            }}
          >
            Sign Out
          </a>
        )}
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
