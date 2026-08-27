import { useState, type FormEvent } from "react";
import type { Contact, Deal, DealStage } from "../types";
import ConfirmDeleteButton from "./ConfirmDeleteButton";

const STAGES: DealStage[] = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];

interface DealFormProps {
  initial?: Deal;
  contacts: Contact[];
  defaultStage?: DealStage;
  onSubmit: (deal: Omit<Deal, "id">) => void;
  onDelete?: () => void;
}

export default function DealForm({ initial, contacts, defaultStage, onSubmit, onDelete }: DealFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [contactId, setContactId] = useState(initial?.contactId ?? contacts[0]?.id ?? "");
  const [value, setValue] = useState(initial ? String(initial.value) : "");
  const [stage, setStage] = useState<DealStage>(initial?.stage ?? defaultStage ?? "New");
  const [closeDate, setCloseDate] = useState(
    initial?.closeDate ?? new Date().toISOString().slice(0, 10)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contactId) return;
    onSubmit({
      title: title.trim(),
      contactId,
      value: Number(value) || 0,
      stage,
      closeDate,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Deal Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <div className="form-row">
        <label>
          Contact
          <select value={contactId} onChange={(e) => setContactId(e.target.value)} required>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.company}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stage
          <select value={stage} onChange={(e) => setStage(e.target.value as DealStage)}>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Value (USD)
          <input type="number" min="0" step="100" value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <label>
          Close Date
          <input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        {onDelete && <ConfirmDeleteButton label="Delete Deal" onConfirm={onDelete} />}
        <button type="submit" className="btn btn-primary">
          {initial ? "Save Changes" : "Add Deal"}
        </button>
      </div>
    </form>
  );
}
