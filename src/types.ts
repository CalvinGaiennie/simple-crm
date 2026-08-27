export type DealStage = "New" | "Contacted" | "Proposal" | "Negotiation" | "Won" | "Lost";

export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  avatarColor: string;
  tags: string[];
  lastContacted: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: DealStage;
  closeDate: string;
}

export interface Activity {
  id: string;
  contactId: string;
  type: "call" | "email" | "meeting" | "note";
  summary: string;
  date: string;
}
