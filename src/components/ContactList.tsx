import { Contact, ContactStatus } from "../types";

export default function ContactList({
  contacts,
  onDelete,
  onStatusChange,
}: {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: ContactStatus) => void;
}) {
  if (contacts.length === 0) {
    return <p className="muted">No contacts yet. Add your first one above.</p>;
  }

  return (
    <div className="card" style={{ padding: 0, overflowX: "auto" }}>
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>
                <strong>{c.name}</strong>
                {c.notes && <div className="muted">{c.notes}</div>}
              </td>
              <td>{c.company || "—"}</td>
              <td>{c.email || "—"}</td>
              <td>{c.phone || "—"}</td>
              <td>
                <select
                  className={`status-badge status-${c.status}`}
                  style={{ border: "none" }}
                  value={c.status}
                  onChange={(e) =>
                    onStatusChange(c.id, e.target.value as ContactStatus)
                  }
                >
                  <option value="lead">Lead</option>
                  <option value="active">Active</option>
                  <option value="customer">Customer</option>
                  <option value="churned">Churned</option>
                </select>
              </td>
              <td className="row-actions">
                <button className="secondary" onClick={() => onDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
