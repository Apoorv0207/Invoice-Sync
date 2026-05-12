import { useEffect, useState } from "react";
import "./App.css";
import type { Invoice } from "./types/invoice";
import socket from "./socket";
import InvoiceTable from "./components/InvoiceTable";
import AddInvoiceForm from "./components/AddInvoiceForm";
import ConnectionStatus from "./components/ConnectionStatus";

const App = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetch("https://invoice-sync-backend.onrender.com/api/invoices")
      .then((res) => res.json())
      .then((data: Invoice[]) => setInvoices(data))
      .catch((err) => console.error("Failed to fetch invoices:", err));
  }, []);

  useEffect(() => {
    const onInvoiceAdded = (invoice: Invoice) => {
      setInvoices((prev) => [{ ...invoice, isNew: true }, ...prev]);
    };

    const onInvoiceDeleted = (id: string) => {
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
    };

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

  // Returns true if password was correct, false if not
  const handleDelete = async (id: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`https://invoice-sync-backend.onrender.com/api/invoices/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": password },
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "pending" | "paid" | "rejected",
    password: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(`https://invoice-sync-backend.onrender.com/api/invoices/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Invoice Dashboard</h1>
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