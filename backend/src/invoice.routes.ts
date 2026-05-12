import { Router, Request, Response } from "express";
import type { Server } from "socket.io";
import Invoice from "./invoice.model";

const createInvoiceRouter = (io: Server): Router => {
  const router = Router();

  // GET /api/invoices - return all invoices, newest first
  router.get("/", async (_req: Request, res: Response) => {
    try {
      const invoices = await Invoice.find().sort({ createdAt: -1 });
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // POST /api/invoices - create new invoice and broadcast
  router.post("/", async (req: Request, res: Response) => {
    try {
      const { vendorName, amount, status } = req.body as {
        vendorName: string;
        amount: number;
        status: "pending" | "paid" | "rejected";
      };

      if (!vendorName || amount === undefined) {
        res.status(400).json({ message: "vendorName and amount are required" });
        return;
      }

      const newInvoice = await Invoice.create({ vendorName, amount, status });
      io.emit("invoice_added", newInvoice);
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  // DELETE /api/invoices/:id - delete invoice and broadcast
  router.delete("/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await Invoice.findByIdAndDelete(req.params["id"]);

      if (!deleted) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }

      io.emit("invoice_deleted", req.params["id"]);
      res.status(200).json({ message: "Invoice deleted" });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      res.status(500).json({ message: "Failed to delete invoice" });
    }
  });

  // PATCH /api/invoices/:id/status - update status and broadcast
  router.patch("/:id/status", async (req: Request, res: Response) => {
    try {
      const { status } = req.body as {
        status: "pending" | "paid" | "rejected";
      };

      if (!status) {
        res.status(400).json({ message: "status is required" });
        return;
      }

      const updated = await Invoice.findByIdAndUpdate(
        req.params["id"],
        { status },
        { new: true }
      );

      if (!updated) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }

      io.emit("invoice_updated", updated);
      res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  return router;
};

export default createInvoiceRouter;