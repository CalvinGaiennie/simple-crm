import { useMemo, useState } from "react";
import { useData } from "../data/store";
import Modal from "../components/Modal";
import ContactForm from "../components/ContactForm";
import type { Contact } from "../types";

export default function Contacts() {
  const { contacts, deals, activities, addContact, updateContact, deleteContact } = useData();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(contacts[0]?.id ?? null);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [query, contacts]);

  const selected = contacts.find((c) => c.id === selectedId) ?? filtered[0] ?? null;
  const selectedDeals = selected ? deals.filter((d) => d.contactId === selected.id) : [];
  const selectedActivity = selected ? activities.filter((a) => a.contactId === selected.id) : [];

  const initials = (name: string) =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleAdd = (contact: Omit<Contact, "id">) => {
    const created = addContact(contact);
    setSelectedId(created.id);
    setModal(null);
  };

  const handleEdit = (contact: Omit<Contact, "id">) => {
    if (!selected) return;
    updateContact(selected.id, contact);
    setModal(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    deleteContact(selected.id);
    setSelectedId(null);
    setModal(null);
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Contacts</h1>
          <p>{contacts.length} people across your accounts.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setModal("add")}>
          + New Contact
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search by name, company, or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="contacts-layout">
        <div className="contact-list">
          {filtered.map((contact) => (
            <button
              key={contact.id}
              className={`contact-row ${selected?.id === contact.id ? "active" : ""}`}
              onClick={() => setSelectedId(contact.id)}
            >
              <span className="avatar" style={{ background: contact.avatarColor }}>
                {initials(contact.name)}
              </span>
              <div className="contact-row-info">
                <div className="contact-row-name">{contact.name}</div>
                <div className="contact-row-company">{contact.company}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && <div className="empty-state">No contacts match "{query}".</div>}
        </div>

        {selected && (
          <div className="contact-detail panel">
            <div className="contact-detail-header">
              <span className="avatar avatar-lg" style={{ background: selected.avatarColor }}>
                {initials(selected.name)}
              </span>
              <div className="contact-detail-heading">
                <h2>{selected.name}</h2>
                <div className="contact-detail-title">
                  {selected.title ? `${selected.title} at ${selected.company}` : selected.company}
                </div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={() => setModal("edit")}>
                Edit
              </button>
            </div>

            <div className="contact-detail-fields">
              <div>
                <span className="field-label">Email</span>
                <span>{selected.email}</span>
              </div>
              <div>
                <span className="field-label">Phone</span>
                <span>{selected.phone}</span>
              </div>
              <div>
                <span className="field-label">Last Contacted</span>
                <span>{selected.lastContacted}</span>
              </div>
            </div>

            <div className="tag-list">
              {selected.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>

            <h3>Deals</h3>
            {selectedDeals.length > 0 ? (
              <ul className="mini-list">
                {selectedDeals.map((deal) => (
                  <li key={deal.id}>
                    <span>{deal.title}</span>
                    <span className={`stage-pill stage-${deal.stage.toLowerCase()}`}>{deal.stage}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No deals yet.</div>
            )}

            <h3>Activity</h3>
            {selectedActivity.length > 0 ? (
              <ul className="mini-list">
                {selectedActivity.map((item) => (
                  <li key={item.id}>
                    <span>{item.summary}</span>
                    <span className="activity-date">{item.date}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">No activity logged.</div>
            )}
          </div>
        )}
      </div>

      {modal === "add" && (
        <Modal title="New Contact" onClose={() => setModal(null)}>
          <ContactForm onSubmit={handleAdd} />
        </Modal>
      )}

      {modal === "edit" && selected && (
        <Modal title="Edit Contact" onClose={() => setModal(null)}>
          <ContactForm initial={selected} onSubmit={handleEdit} onDelete={handleDelete} />
        </Modal>
      )}
    </div>
  );
}
