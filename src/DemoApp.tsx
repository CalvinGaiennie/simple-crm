import { useState } from "react";
import { Contact, ContactStatus, NewContact } from "./types";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

const seedContacts: Contact[] = [
  {
    id: "demo-1",
    user_id: "demo",
    name: "Priya Shah",
    email: "priya@northwind.io",
    phone: "(555) 010-2231",
    company: "Northwind",
    status: "paid_in_full",
    notes: "Renewed annual plan in March.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo",
    name: "Marcus Lee",
    email: "marcus@brightpath.co",
    phone: "(555) 048-1190",
    company: "Brightpath",
    status: "proposal_sent",
    notes: "Follow up on pricing proposal.",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-3",
    user_id: "demo",
    name: "Ana Torres",
    email: "ana@fielder.dev",
    phone: "",
    company: "Fielder",
    status: "warm",
    notes: "Met at conference, warm intro from Marcus.",
    created_at: new Date().toISOString(),
  },
];

export default function DemoApp() {
  const [contacts, setContacts] = useState<Contact[]>(seedContacts);

  async function handleCreate(contact: NewContact) {
    const newContact: Contact = {
      ...contact,
      id: `demo-${Date.now()}`,
      user_id: "demo",
      created_at: new Date().toISOString(),
    };
    setContacts((prev) => [newContact, ...prev]);
  }

  function handleDelete(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  function handleStatusChange(id: string, status: ContactStatus) {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
  }

  return (
    <div className="container">
      <div className="demo-banner">
        <strong>Demo mode</strong> — not connected to Supabase, so changes
        here aren't saved. Add your Supabase URL and anon key as{" "}
        <code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code>{" "}
        (see <code>.env.example</code> and the README) to enable real
        accounts and persistence.
      </div>

      <header className="topbar">
        <h1>Simple CRM</h1>
      </header>

      <ContactForm onCreate={handleCreate} />

      <ContactList
        contacts={contacts}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
