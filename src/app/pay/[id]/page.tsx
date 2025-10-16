"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc } from "firebase/firestore";
import Image from "next/image";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import type { PaymentRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();

  const paymentId = params.id as string;
  const isPublic = searchParams.get("public") === 'true';

  const docRef = useMemoFirebase(() => {
    if (!firestore || !paymentId) return null;
    const collectionPath = isPublic ? 'publicPaymentRequests' : `paymentRequests`; // This assumes private links are at a root level if not public, adjust if nested under users
    // For a real app, you might need more complex logic to find a private link if not public.
    // The current logic on homepage creates user-links under /users/{uid}/paymentRequests. A user must be logged in to view that.
    // For simplicity, we are assuming the shareable link is always from the public or a user-specific root collection. The current logic might need enhancement for private sharing.
    // Let's assume for now that shared links are either public, or if private, they are accessed by the owner who is logged in.
    // The prompt implies a non-logged in user can view the link, so public is the main path here.
    if (isPublic) {
        return doc(firestore, 'publicPaymentRequests', paymentId);
    }
    // This part is tricky without knowing who the user is. The page is public.
    // We will stick to the public path as the query param indicates.
    // If you need to support private links for anyone, the data model needs adjustment.
    return doc(firestore, 'publicPaymentRequests', paymentId);


  }, [firestore, paymentId, isPublic]);

  const { data: payment, isLoading, error } = useDoc<PaymentRequest>(docRef);

  const qrCodeUrl = useMemo(() => {
    if (!payment?.upiLink) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(payment.upiLink)}`;
  }, [payment?.upiLink]);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copied to clipboard!` });
  };
  
  const handleShare = async () => {
    const shareData = {
      title: "UPI Payment Request",
      text: `${payment?.name} is requesting a payment of ₹${payment?.amount.toFixed(2)}.`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Sharing failed", error);
        // Fallback to copying link if share is cancelled or fails
        copyToClipboard(window.location.href, "Share Link");
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(window.location.href, "Share Link");
    }
  };


  const isExpired = useMemo(() => {
    if (!payment?.expiry) return false;
    const expiryDate = (payment.expiry as any).toDate ? (payment.expiry as any).toDate() : new Date(payment.expiry);
    return new Date() > expiryDate;
  }, [payment?.expiry]);

  if (isLoading) {
    return <PaymentPageSkeleton />;
  }

  if (error) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    There was an error loading the payment details. Please check the link and try again.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!payment) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
             <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Payment Not Found</AlertTitle>
                <AlertDescription>
                    The payment link is invalid or has been deleted.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (isExpired) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
             <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Link Expired</AlertTitle>
                <AlertDescription>
                    This payment link has expired and is no longer valid.
                </AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl">Payment Request</CardTitle>
          <CardDescription>
            {payment.name} is requesting a payment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-5xl font-bold tracking-tight">₹{payment.amount.toFixed(2)}</p>
                <p className="text-muted-foreground">{payment.notes}</p>
            </div>

          <div className="p-2 bg-white rounded-lg border shadow-md">
            {qrCodeUrl && <Image src={qrCodeUrl} alt="UPI QR Code" width={256} height={256} />}
          </div>

           <div className="w-full space-y-4">
                <Button asChild className="w-full text-lg py-6">
                    <a href={payment.upiLink}>
                        Pay with UPI App
                    </a>
                </Button>

                <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(window.location.href, "Page Link")}>
                        <Copy className="mr-2" /> Copy Page Link
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2" /> Share Page
                    </Button>
                </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
                <p>Requested to <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{payment.upiId}</span></p>
                 <p>
                    Link created {formatDistanceToNow( (payment.timestamp as any).toDate ? (payment.timestamp as any).toDate() : new Date(payment.timestamp), { addSuffix: true })}
                </p>
                {payment.expiry && (
                     <p>
                        Expires in {formatDistanceToNow( (payment.expiry as any).toDate ? (payment.expiry as any).toDate() : new Date(payment.expiry) )}
                    </p>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentPageSkeleton() {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
        <Card className="w-full max-w-lg">
            <CardHeader className="items-center text-center">
                 <Skeleton className="h-8 w-48" />
                 <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                 <div className="text-center">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-4 w-32 mt-2" />
                </div>
                <Skeleton className="h-64 w-64 rounded-lg" />
                 <div className="w-full space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <div className="flex w-full gap-2">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 flex-1" />
                    </div>
                </div>
                 <div className="text-xs text-muted-foreground text-center space-y-1">
                    <Skeleton className="h-3 w-48" />
                    <Skeleton className="h-3 w-40" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }
