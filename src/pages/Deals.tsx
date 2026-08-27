import { contacts, deals } from "../data/fakeData";
import type { DealStage } from "../types";

const STAGES: DealStage[] = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Deals() {
  const contactById = (id: string) => contacts.find((c) => c.id === id);

  return (
    <div>
      <div className="page-header">
        <h1>Pipeline</h1>
        <p>{deals.length} deals across {STAGES.length} stages.</p>
      </div>

      <div className="board">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div key={stage} className="board-column">
              <div className="board-column-header">
                <span className={`stage-pill stage-${stage.toLowerCase()}`}>{stage}</span>
                <span className="board-column-count">{stageDeals.length}</span>
              </div>
              <div className="board-column-value">{currency(stageValue)}</div>
              <div className="board-column-cards">
                {stageDeals.map((deal) => {
                  const contact = contactById(deal.contactId);
                  return (
                    <div key={deal.id} className="deal-card">
                      <div className="deal-card-title">{deal.title}</div>
                      <div className="deal-card-value">{currency(deal.value)}</div>
                      {contact && (
                        <div className="deal-card-contact">
                          <span className="avatar avatar-sm" style={{ background: contact.avatarColor }}>
                            {contact.name
                              .split(" ")
                              .map((p) => p[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                          {contact.name}
                        </div>
                      )}
                      <div className="deal-card-date">Closes {deal.closeDate}</div>
                    </div>
                  );
                })}
                {stageDeals.length === 0 && <div className="empty-state">No deals</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
