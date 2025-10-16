import type { Timestamp } from "firebase/firestore";

export interface PaymentRequest {
  id: string;
  userId: string | null; // Can be null for public links
  name: string;
  upiId: string;
  amount: number;
  notes?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Timestamp | Date;
  expiry?: Timestamp | Date | null;
  upiLink: string;
}
