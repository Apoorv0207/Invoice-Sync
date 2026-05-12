import { useState } from "react";
import type { Invoice } from "../types/invoice";
import InvoiceRow from "./InvoiceRow";

interface Props {
  invoices: Invoice[];
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: "pending" | "paid" | "rejected") => void;
}

const InvoiceTable = ({ invoices, onDelete, onStatusChange }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = invoices.filter((inv) =>
    inv.vendorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="table-wrapper">
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by vendor name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="invoice-count">
          {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className="empty-state">
                  {search
                    ? `No invoices found for "${search}"`
                    : "No invoices yet. Add one above!"}
                </div>
              </td>
            </tr>
          ) : (
            filtered.map((invoice) => (
              <InvoiceRow
                key={invoice._id}
                invoice={invoice}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;