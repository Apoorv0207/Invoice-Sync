export interface Invoice {
  id: string;
  vendorName: string;
  amount: number;
  status: "pending" | "paid" | "rejected";
  createdAt: Date;
}