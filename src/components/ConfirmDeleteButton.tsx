import { useState } from "react";

interface ConfirmDeleteButtonProps {
  label: string;
  onConfirm: () => void;
}

export default function ConfirmDeleteButton({ label, onConfirm }: ConfirmDeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="confirm-delete">
        <span>Are you sure?</span>
        <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          Confirm
        </button>
      </div>
    );
  }

  return (
    <button type="button" className="btn btn-danger" onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}
