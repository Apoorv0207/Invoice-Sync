import { useState } from "react";

interface Props {
  onConfirm: (password: string) => void;
  onCancel: () => void;
  action: "delete" | "update";
  error: string;
}

const PasswordModal = ({ onConfirm, onCancel, action, error }: Props) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    onConfirm(password);
    setPassword("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">
          {action === "delete" ? "🗑️ Confirm Delete" : "🔄 Confirm Status Update"}
        </h3>
        <p className="modal-subtitle">
          Enter the admin password to {action === "delete" ? "delete this invoice" : "update the status"}.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="modal-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className={action === "delete" ? "btn-confirm-delete" : "btn-confirm-update"}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;