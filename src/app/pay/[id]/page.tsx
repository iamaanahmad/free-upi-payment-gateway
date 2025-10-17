"use client";

import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import type { PaymentRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export const dynamic = 'force-dynamic';

export default function PayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const paymentId = params.id as string;
  const isPublic = searchParams.get("public") === 'true';

  const docRef = useMemoFirebase(() => {
    if (!firestore || !paymentId) return null;
    
    // For non-public links, we need to know the user to find the document.
    // If the user is still loading, we can't build the path yet.
    if (!isPublic) {
        if (!user) return null; // Wait for user object
        return doc(firestore, `users/${user.uid}/paymentRequests`, paymentId);
    }
    
    // Public links don't depend on the user.
    return doc(firestore, 'publicPaymentRequests', paymentId);

  }, [firestore, paymentId, isPublic, user]);

  const { data: payment, isLoading, error } = useDoc<PaymentRequest>(docRef);

  useEffect(() => {
    if (payment) {
        document.title = `Payment Request from ${payment.name} for ₹${payment.amount.toFixed(2)}`;
    }
  }, [payment]);

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
        copyToClipboard(window.location.href, "Page Link");
      }
    } else {
      copyToClipboard(window.location.href, "Page Link");
    }
  };


  const isExpired = useMemo(() => {
    if (!payment?.expiry) return false;
    const expiryDate = toDate(payment.expiry);
    return new Date() > expiryDate;
  }, [payment?.expiry]);

  if (isLoading || !docRef) {
    return <PaymentPageSkeleton />;
  }

  if (error || !payment) {
    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
            <Alert variant="destructive" className="max-w-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    This payment link is invalid, has expired, or you do not have permission to view it. Please check the link and try again.
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
            {qrCodeUrl && <Image src={qrCodeUrl} alt={`UPI QR Code for payment to ${payment.name}`} width={256} height={256} />}
          </div>

           <div className="w-full space-y-4">
                <Button asChild className="w-full text-lg py-6">
                    <a href={payment.upiLink}>
                        Pay with any UPI App
                    </a>
                </Button>

                <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(window.location.href, "Page Link")}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Page Link
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> Share Page
                    </Button>
                </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
                <p>Requested to <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{payment.upiId}</span></p>
                 <p>
                    Link created {formatDistanceToNow(toDate(payment.timestamp), { addSuffix: true })}
                </p>
                {payment.expiry && (
                     <p>
                        Expires in {formatDistanceToNow(toDate(payment.expiry))}
                    </p>
                )}
            </div>
            <Separator className="w-full" />
            <div className="text-center text-xs text-muted-foreground space-y-2">
                <Link href="." className="text-sm text-primary hover:underline">
                    Create your own free UPI payment link
                </Link>
                <p>Powered by CIT India</p>
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
                 <div className="text-center space-y-2">
                    <Skeleton className="h-12 w-40 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
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
                    <Skeleton className="h-3 w-48 mx-auto" />
                    <Skeleton className="h-3 w-40 mx-auto" />
                </div>
            </CardContent>
        </Card>
      </div>
    );
  }
