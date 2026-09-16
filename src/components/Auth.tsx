import { FormEvent, useState } from "react";
import { supabase } from "../supabaseClient";

// Only rendered inside ConnectedApp, which requires isSupabaseConfigured.
const client = supabase!;

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } =
      mode === "sign-in"
        ? await client.auth.signInWithPassword({ email, password })
        : await client.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
    } else if (mode === "sign-up") {
      setMessage("Check your inbox to confirm your email, then sign in.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-card card">
      <h1>Simple CRM</h1>
      <p className="muted">
        {mode === "sign-in" ? "Sign in to your account." : "Create an account."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
          />
        </label>
        {error && <p className="error-text">{error}</p>}
        {message && <p className="muted">{message}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button
        type="button"
        className="secondary"
        style={{ marginTop: 12, border: "none" }}
        onClick={() => {
          setMode(mode === "sign-in" ? "sign-up" : "sign-in");
          setError(null);
          setMessage(null);
        }}
      >
        {mode === "sign-in" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </div>
  );
}
