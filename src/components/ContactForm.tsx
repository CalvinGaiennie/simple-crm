import { FormEvent, useState } from "react";
import { NewContact, ContactStatus, CONTACT_STATUSES } from "../types";

const emptyForm: NewContact = {
  name: "",
  email: "",
  phone: "",
  company: "",
  status: "cold",
  notes: "",
};

export default function ContactForm({
  onCreate,
}: {
  onCreate: (contact: NewContact) => Promise<void>;
}) {
  const [form, setForm] = useState<NewContact>(emptyForm);
  const [saving, setSaving] = useState(false);

  function update<K extends keyof NewContact>(key: K, value: NewContact[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    await onCreate(form);
    setForm(emptyForm);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 24 }}>
      <div className="form-grid">
        <label className="full">
          Name *
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email ?? ""}
            onChange={(e) => update("email", e.target.value)}
          />
        </label>
        <label>
          Phone
          <input
            value={form.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </label>
        <label>
          Company
          <input
            value={form.company ?? ""}
            onChange={(e) => update("company", e.target.value)}
          />
        </label>
        <label>
          Status
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value as ContactStatus)}
          >
            {CONTACT_STATUSES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="full">
          Notes
          <textarea
            rows={2}
            value={form.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
          />
        </label>
      </div>
      <button type="submit" disabled={saving}>
        {saving ? "Adding..." : "Add contact"}
      </button>
    </form>
  );
}
