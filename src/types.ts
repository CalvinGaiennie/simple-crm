export const CONTACT_STATUSES = [
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_set", label: "Meeting Set" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "closed", label: "Closed" },
  { value: "active", label: "Active" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid_in_full", label: "Paid in Full" },
  { value: "passed", label: "Passed" },
] as const;

export type ContactStatus = (typeof CONTACT_STATUSES)[number]["value"];

export interface Contact {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: ContactStatus;
  notes: string | null;
  created_at: string;
}

export type NewContact = Pick<
  Contact,
  "name" | "email" | "phone" | "company" | "status" | "notes"
>;
