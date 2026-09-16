import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import { Contact, ContactStatus, NewContact } from "./types";
import Auth from "./components/Auth";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadContacts();
    } else {
      setContacts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function loadContacts() {
    setLoadingContacts(true);
    setError(null);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setContacts(data as Contact[]);
    }
    setLoadingContacts(false);
  }

  async function handleCreate(contact: NewContact) {
    if (!session) return;
    const { data, error } = await supabase
      .from("contacts")
      .insert({ ...contact, user_id: session.user.id })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else {
      setContacts((prev) => [data as Contact, ...prev]);
    }
  }

  async function handleDelete(id: string) {
    const previous = contacts;
    setContacts((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      setError(error.message);
      setContacts(previous);
    }
  }

  async function handleStatusChange(id: string, status: ContactStatus) {
    const previous = contacts;
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    const { error } = await supabase
      .from("contacts")
      .update({ status })
      .eq("id", id);
    if (error) {
      setError(error.message);
      setContacts(previous);
    }
  }

  if (loadingSession) {
    return null;
  }

  if (!session) {
    return (
      <div className="container">
        <Auth />
      </div>
    );
  }

  return (
    <div className="container">
      <header className="topbar">
        <h1>Simple CRM</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="muted">{session.user.email}</span>
          <button className="secondary" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      <ContactForm onCreate={handleCreate} />

      {loadingContacts ? (
        <p className="muted">Loading contacts...</p>
      ) : (
        <ContactList
          contacts={contacts}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
