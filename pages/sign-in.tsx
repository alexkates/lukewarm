import { useState } from "react";

import supabase from "../src/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  async function signIn() {
    const { error } = await supabase.auth.signIn(
      {
        email,
      },
      {
        redirectTo: "window.location.origin",
      }
    );
    if (error) {
      console.log({ error });
    } else {
      setSubmitted(true);
    }
  }
  if (submitted) {
    return (
      <main>
        <h1>Please check your email to sign in</h1>
      </main>
    );
  }
  return (
    <main>
      <h1>Sign In</h1>
      <input
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: 10 }}
      />
      <button onClick={() => signIn()}>Sign In</button>
    </main>
  );
}
