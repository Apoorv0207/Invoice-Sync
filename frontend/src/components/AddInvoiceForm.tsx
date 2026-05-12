import { useState } from "react";

interface FormState {
  vendorName: string;
  amount: string;
  status: "pending" | "paid" | "rejected";
}

const AddInvoiceForm = () => {
  const [form, setForm] = useState<FormState>({
    vendorName: "",
    amount: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vendorName || !form.amount) return;

    setLoading(true);
    try {
      await fetch("http://localhost:5000/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorName: form.vendorName,
          amount: Number(form.amount),
          status: form.status,
        }),
      });
      // Socket handles the UI update via invoice_added event
      setForm({ vendorName: "", amount: "", status: "pending" });
    } catch (err) {
      console.error("Failed to add invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Add New Invoice</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="vendorName">Vendor Name</label>
          <input
            id="vendorName"
            name="vendorName"
            type="text"
            placeholder="e.g. Acme Corp"
            value={form.vendorName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="e.g. 5000"
            value={form.amount}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Adding..." : "Add Invoice"}
        </button>
      </form>
    </div>
  );
};

export default AddInvoiceForm;