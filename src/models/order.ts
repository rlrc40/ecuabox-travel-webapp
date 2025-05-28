export type Order = {
  strypeId: string;
  paymentStatus: "pending" | "paid" | "failed";
  data: object;
};
