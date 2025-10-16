import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Timestamp } from "firebase/firestore"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const toDate = (date: Timestamp | Date | null | undefined): Date => {
  if (!date) return new Date();
  if (typeof date === 'object' && 'toDate' in date) {
    return date.toDate();
  }
  return date as Date;
};
