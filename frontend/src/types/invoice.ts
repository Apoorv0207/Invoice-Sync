export interface Invoice {
  _id: string;
  vendorName: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  createdAt: string;
  isNew?: boolean;
}