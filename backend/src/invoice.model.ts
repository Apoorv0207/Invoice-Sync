import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true, // auto adds createdAt and updatedAt
  }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;