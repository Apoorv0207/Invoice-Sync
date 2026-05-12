import { useEffect, useRef, useState } from "react";
import type { Invoice } from "../types/invoice";
import PasswordModal from "./PasswordModal";

interface Props {
  invoice: Invoice;
  onDelete: (id: string, password: string) => Promise<boolean>;
  onStatusChange: (id: string, status: "pending" | "paid" | "rejected", password: string) => Promise<boolean>;
}

type ModalAction =
  | { type: "delete" }
  | { type: "update"; status: "pending" | "paid" | "rejected" };

const InvoiceRow = ({ invoice, onDelete, onStatusChange }: Props) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  const [pendingAction, setPendingAction] = useState<ModalAction | null>(null);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (invoice.isNew && rowRef.current) {
      rowRef.current.classList.add("row-new");
      const timer = setTimeout(() => {
        rowRef.current?.classList.remove("row-new");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [invoice.isNew]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "pending" | "paid" | "rejected";
    if (newStatus === invoice.status) return;
    setPendingAction({ type: "update", status: newStatus });
    setPasswordError("");
  };

  const handleDeleteClick = () => {
    setPendingAction({ type: "delete" });
    setPasswordError("");
  };

  const handleConfirm = async (password: string) => {
    if (!pendingAction) return;

    let success = false;

    if (pendingAction.type === "delete") {
      success = await onDelete(invoice._id, password);
    } else {
      success = await onStatusChange(invoice._id, pendingAction.status, password);
    }

    if (success) {
      setPendingAction(null);
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  };

  const handleCancel = () => {
    setPendingAction(null);
    setPasswordError("");
  };

  return (
    <>
      <tr ref={rowRef}>
        <td>{invoice.vendorName}</td>
        <td>₹{invoice.amount.toLocaleString()}</td>
        <td>
          <select
            className={`status-select badge badge-${invoice.status}`}
            value={invoice.status}
            onChange={handleStatusChange}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </td>
        <td>
          {new Date(invoice.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td>
          <button className="btn-delete" onClick={handleDeleteClick}>
            Delete
          </button>
        </td>
      </tr>

      {pendingAction && (
        <PasswordModal
          action={pendingAction.type}
          error={passwordError}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default InvoiceRow;