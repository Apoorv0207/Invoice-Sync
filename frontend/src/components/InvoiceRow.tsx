import { useEffect, useRef } from "react";
import type { Invoice } from "../types/invoice";

interface Props {
  invoice: Invoice;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "pending" | "paid" | "rejected") => void;
}

const InvoiceRow = ({ invoice, onDelete, onStatusChange }: Props) => {
  const rowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (invoice.isNew && rowRef.current) {
      rowRef.current.classList.add("row-new");
      const timer = setTimeout(() => {
        rowRef.current?.classList.remove("row-new");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [invoice.isNew]);

  return (
    <tr ref={rowRef}>
      <td>{invoice.vendorName}</td>
      <td>₹{invoice.amount.toLocaleString()}</td>
      <td>
        <select
          className={`status-select badge badge-${invoice.status}`}
          value={invoice.status}
          onChange={(e) =>
            onStatusChange(
              invoice._id,
              e.target.value as "pending" | "paid" | "rejected"
            )
          }
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
        <button
          className="btn-delete"
          onClick={() => onDelete(invoice._id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default InvoiceRow;