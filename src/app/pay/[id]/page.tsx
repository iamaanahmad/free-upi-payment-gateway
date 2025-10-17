import { notFound } from "next/navigation";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import { initializeApp } from "firebase/app";
import type { PaymentRequest } from "@/lib/types";
import type { Metadata } from "next";
import PayPageClient from "./PayPageClient";

export const dynamic = 'force-dynamic';

interface PayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ public?: string }>;
}

export async function generateMetadata({ params, searchParams }: PayPageProps): Promise<Metadata> {
  const { id } = await params;
  const { public: isPublic } = await searchParams;

  try {
    // Initialize Firebase for server-side data fetching
    const app = initializeApp(firebaseConfig);
    const firestore = getFirestore(app);

    const paymentId = id;
    const collectionPath = isPublic === 'true' ? 'publicPaymentRequests' : `users/${'dummy'}/paymentRequests`; // We can't get user on server side for private links
    const docRef = doc(firestore, collectionPath, paymentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return {
        title: 'Payment Link Not Found | UPI PG',
        description: 'This payment link is invalid or has expired.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const payment = docSnap.data() as PaymentRequest;

    return {
      title: `Payment Request from ${payment.name} for ₹${payment.amount.toFixed(2)} | UPI PG`,
      description: `${payment.name} is requesting a payment of ₹${payment.amount.toFixed(2)}. ${payment.notes ? `Note: ${payment.notes}` : ''} Pay securely using any UPI app.`,
      openGraph: {
        title: `Payment Request from ${payment.name}`,
        description: `${payment.name} is requesting ₹${payment.amount.toFixed(2)}. ${payment.notes || 'Pay securely with UPI.'}`,
        type: 'website',
        images: [
          {
            url: `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(payment.upiLink)}`,
            width: 400,
            height: 400,
            alt: `UPI QR Code for payment to ${payment.name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Payment Request from ${payment.name}`,
        description: `${payment.name} is requesting ₹${payment.amount.toFixed(2)}. ${payment.notes || 'Pay securely with UPI.'}`,
        images: [`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(payment.upiLink)}`],
      },
      robots: {
        index: false, // Don't index payment pages
        follow: false,
      },
    };
  } catch (error) {
    return {
      title: 'Payment Request | UPI PG',
      description: 'Secure UPI payment request page.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PayPage({ params, searchParams }: PayPageProps) {
  const { id } = await params;
  const { public: isPublic } = await searchParams;

  // Initialize Firebase for server-side data fetching
  const app = initializeApp(firebaseConfig);
  const firestore = getFirestore(app);

  const paymentId = id;
  const collectionPath = isPublic === 'true' ? 'publicPaymentRequests' : `users/${'dummy'}/paymentRequests`; // We can't get user on server side for private links
  const docRef = doc(firestore, collectionPath, paymentId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const payment = docSnap.data() as PaymentRequest;

  return <PayPageClient payment={payment} paymentId={paymentId} isPublic={isPublic === 'true'} />;
}
