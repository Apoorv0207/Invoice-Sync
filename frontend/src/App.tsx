import { useEffect, useState } from "react";
import "./App.css";
import type { Invoice } from "./types/invoice";
import socket from "./socket";
import InvoiceTable from "./components/InvoiceTable";
import AddInvoiceForm from "./components/AddInvoiceForm";
import ConnectionStatus from "./components/ConnectionStatus";

const App = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch initial invoices on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/invoices")
      .then((res) => res.json())
      .then((data: Invoice[]) => setInvoices(data))
      .catch((err) => console.error("Failed to fetch invoices:", err));
  }, []);

  // Socket listeners for real-time events
  useEffect(() => {
    // New invoice added by any client
    const onInvoiceAdded = (invoice: Invoice) => {
      setInvoices((prev) => [{ ...invoice, isNew: true }, ...prev]);
    };

    // Invoice deleted by any client
    const onInvoiceDeleted = (id: string) => {
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    };

    // Invoice status updated by any client
    const onInvoiceUpdated = (updated: Invoice) => {
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === updated._id ? updated : inv))
      );
    };

    socket.on("invoice_added", onInvoiceAdded);
    socket.on("invoice_deleted", onInvoiceDeleted);
    socket.on("invoice_updated", onInvoiceUpdated);

    return () => {
      socket.off("invoice_added", onInvoiceAdded);
      socket.off("invoice_deleted", onInvoiceDeleted);
      socket.off("invoice_updated", onInvoiceUpdated);
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${id}`, {
        method: "DELETE",
      });
      // Socket will handle UI update via invoice_deleted event
    } catch (err) {
      console.error("Failed to delete invoice:", err);
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "pending" | "paid" | "rejected"
  ) => {
    try {
      await fetch(`http://localhost:5000/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      // Socket will handle UI update via invoice_updated event
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Invoice Sync</h1>
        <ConnectionStatus />
      </div>
      <AddInvoiceForm />
      <InvoiceTable
        invoices={invoices}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default App;