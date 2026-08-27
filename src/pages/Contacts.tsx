import { useMemo, useState } from "react";
import { activities, contacts, deals } from "../data/fakeData";

export default function Contacts() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(contacts[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [query]);

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

  return (
    <div>
      <div className="page-header">
        <h1>Contacts</h1>
        <p>{contacts.length} people across your accounts.</p>
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
              <div>
                <h2>{selected.name}</h2>
                <div className="contact-detail-title">
                  {selected.title} at {selected.company}
                </div>
              </div>
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
    </div>
  );
}
