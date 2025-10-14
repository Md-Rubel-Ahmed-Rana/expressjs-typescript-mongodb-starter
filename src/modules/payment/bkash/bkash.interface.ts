export type IBkashCreatePaymentParams = {
  payable_amount: number;
  invoice_number: string;
  intent?: string; // default: "sale"
};

export type IBkashRefundPayment = {
  paymentID: string;
  trxID: string;
  amount: string;
  sku: string;
  reason?: string;
};

export enum PAYMENT_STATUS {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}
