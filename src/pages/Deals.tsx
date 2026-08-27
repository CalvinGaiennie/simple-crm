import { useState } from "react";
import { useData } from "../data/store";
import Modal from "../components/Modal";
import DealForm from "../components/DealForm";
import type { Deal, DealStage } from "../types";

const STAGES: DealStage[] = ["New", "Contacted", "Proposal", "Negotiation", "Won", "Lost"];

const currency = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function Deals() {
  const { contacts, deals, addDeal, updateDeal, deleteDeal, moveDeal } = useData();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [modal, setModal] = useState<{ mode: "add"; stage: DealStage } | { mode: "edit"; deal: Deal } | null>(
    null
  );

  const contactById = (id: string) => contacts.find((c) => c.id === id);

  const handleDrop = (stage: DealStage) => {
    if (draggingId) moveDeal(draggingId, stage);
    setDraggingId(null);
    setDragOverStage(null);
  };

  const handleAdd = (deal: Omit<Deal, "id">) => {
    addDeal(deal);
    setModal(null);
  };

  const handleEdit = (deal: Omit<Deal, "id">) => {
    if (modal?.mode !== "edit") return;
    updateDeal(modal.deal.id, deal);
    setModal(null);
  };

  const handleDelete = () => {
    if (modal?.mode !== "edit") return;
    deleteDeal(modal.deal.id);
    setModal(null);
  };

  return (
    <div>
      <div className="page-header page-header-row">
        <div>
          <h1>Pipeline</h1>
          <p>
            {deals.length} deals across {STAGES.length} stages.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setModal({ mode: "add", stage: "New" })}
          disabled={contacts.length === 0}
        >
          + New Deal
        </button>
      </div>

      <div className="board">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
          return (
            <div
              key={stage}
              className={`board-column ${dragOverStage === stage ? "drag-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverStage(stage);
              }}
              onDragLeave={() => setDragOverStage((prev) => (prev === stage ? null : prev))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(stage);
              }}
            >
              <div className="board-column-header">
                <span className={`stage-pill stage-${stage.toLowerCase()}`}>{stage}</span>
                <span className="board-column-count">{stageDeals.length}</span>
              </div>
              <div className="board-column-value">{currency(stageValue)}</div>
              <div className="board-column-cards">
                {stageDeals.map((deal) => {
                  const contact = contactById(deal.contactId);
                  return (
                    <div
                      key={deal.id}
                      className={`deal-card ${draggingId === deal.id ? "dragging" : ""}`}
                      draggable
                      onDragStart={(e) => {
                        setDraggingId(deal.id);
                        e.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDragOverStage(null);
                      }}
                    >
                      <div className="deal-card-top">
                        <div className="deal-card-title">{deal.title}</div>
                        <button
                          type="button"
                          className="deal-card-edit"
                          aria-label={`Edit ${deal.title}`}
                          onClick={() => setModal({ mode: "edit", deal })}
                        >
                          ✎
                        </button>
                      </div>
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
                {stageDeals.length === 0 && <div className="empty-state">Drop deals here</div>}
              </div>
            </div>
          );
        })}
      </div>

      {modal?.mode === "add" && (
        <Modal title="New Deal" onClose={() => setModal(null)}>
          <DealForm contacts={contacts} defaultStage={modal.stage} onSubmit={handleAdd} />
        </Modal>
      )}

      {modal?.mode === "edit" && (
        <Modal title="Edit Deal" onClose={() => setModal(null)}>
          <DealForm contacts={contacts} initial={modal.deal} onSubmit={handleEdit} onDelete={handleDelete} />
        </Modal>
      )}
    </div>
  );
}
