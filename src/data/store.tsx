import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { activities, contacts as initialContacts, deals as initialDeals } from "./fakeData";
import type { Contact, Deal } from "../types";

interface DataContextValue {
  contacts: Contact[];
  deals: Deal[];
  activities: typeof activities;
  addContact: (contact: Omit<Contact, "id">) => Contact;
  updateContact: (id: string, updates: Omit<Contact, "id">) => void;
  deleteContact: (id: string) => void;
  addDeal: (deal: Omit<Deal, "id">) => Deal;
  updateDeal: (id: string, updates: Omit<Deal, "id">) => void;
  deleteDeal: (id: string) => void;
  moveDeal: (id: string, stage: Deal["stage"]) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `id-${Date.now()}-${Math.random()}`;

export function DataProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useLocalStorage<Contact[]>("simple-crm:contacts", initialContacts);
  const [deals, setDeals] = useLocalStorage<Deal[]>("simple-crm:deals", initialDeals);

  const addContact: DataContextValue["addContact"] = (contact) => {
    const created: Contact = { ...contact, id: newId() };
    setContacts((prev) => [...prev, created]);
    return created;
  };

  const updateContact: DataContextValue["updateContact"] = (id, updates) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, id } : c)));
  };

  const deleteContact: DataContextValue["deleteContact"] = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeals((prev) => prev.filter((d) => d.contactId !== id));
  };

  const addDeal: DataContextValue["addDeal"] = (deal) => {
    const created: Deal = { ...deal, id: newId() };
    setDeals((prev) => [...prev, created]);
    return created;
  };

  const updateDeal: DataContextValue["updateDeal"] = (id, updates) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates, id } : d)));
  };

  const deleteDeal: DataContextValue["deleteDeal"] = (id) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
  };

  const moveDeal: DataContextValue["moveDeal"] = (id, stage) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  };

  return (
    <DataContext.Provider
      value={{
        contacts,
        deals,
        activities,
        addContact,
        updateContact,
        deleteContact,
        addDeal,
        updateDeal,
        deleteDeal,
        moveDeal,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
}
