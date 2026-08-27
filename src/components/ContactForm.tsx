import { useState, type FormEvent } from "react";
import type { Contact } from "../types";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

const COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6", "#ef4444", "#14b8a6"];

interface ContactFormProps {
  initial?: Contact;
  onSubmit: (contact: Omit<Contact, "id">) => void;
  onDelete?: () => void;
}

export default function ContactForm({ initial, onSubmit, onDelete }: ContactFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [company, setCompany] = useState(initial?.company ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [tags, setTags] = useState(initial?.tags.join(", ") ?? "");
  const [avatarColor, setAvatarColor] = useState(initial?.avatarColor ?? COLORS[0]);
  const [lastContacted, setLastContacted] = useState(
    initial?.lastContacted ?? new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;
    onSubmit({
      name: name.trim(),
      company: company.trim(),
      title: title.trim(),
      email: email.trim(),
      phone: phone.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      avatarColor,
      lastContacted,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Company
          <input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Last Contacted
          <input type="date" value={lastContacted} onChange={(e) => setLastContacted(e.target.value)} />
        </label>
      </div>
      <div className="form-row">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
      </div>
      <label>
        Tags <span className="field-hint">(comma-separated)</span>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Enterprise, Champion" />
      </label>
      <div>
        <span className="field-label">Color</span>
        <div className="swatch-row">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`swatch ${avatarColor === color ? "selected" : ""}`}
              style={{ background: color }}
              onClick={() => setAvatarColor(color)}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      <div className="form-actions">
        {onDelete && <ConfirmDeleteButton label="Delete Contact" onConfirm={onDelete} />}
        <button type="submit" className="btn btn-primary">
          {initial ? "Save Changes" : "Add Contact"}
        </button>
      </div>
    </form>
  );
}
