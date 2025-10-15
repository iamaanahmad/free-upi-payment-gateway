import type { Timestamp } from "firebase/firestore";

export interface PaymentRequest {
  id: string;
  userId: string;
  upiId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Timestamp | Date;
  upiLink: string;
}
