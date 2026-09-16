export type ContactStatus = "lead" | "active" | "customer" | "churned";

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
