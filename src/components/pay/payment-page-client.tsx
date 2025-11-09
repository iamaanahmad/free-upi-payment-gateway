"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { doc } from "firebase/firestore";
import Image from "next/image";
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import type { PaymentRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {useTranslations} from 'next-intl';

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

export default function PaymentPageClient() {
  const t = useTranslations('PayPage');
  const t_toasts = useTranslations('Toasts');
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [tempQrUrl, setTempQrUrl] = useState<string>('');

  const paymentId = params.id as string;
  const isPublic = searchParams.get("public") === 'true';

  const docRef = useMemoFirebase(() => {
    if (!firestore || !paymentId) return null;
    
    if (!isPublic) {
        if (!user) return null; 
        return doc(firestore, `users/${user.uid}/paymentRequests`, paymentId);
    }
    
    return doc(firestore, 'publicPaymentRequests', paymentId);

  }, [firestore, paymentId, isPublic, user]);

  const { data: payment, isLoading, error } = useDoc<PaymentRequest>(docRef);

  useEffect(() => {
    if (payment) {
        const title = typeof payment.amount === 'number' && payment.amount > 0
          ? `Payment Request from ${payment.name} for ₹${payment.amount.toFixed(2)}`
          : `Payment Request from ${payment.name}`;
        document.title = title;
    }
  }, [payment]);

  const qrCodeUrl = useMemo(() => {
    if (!payment?.upiLink) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(payment.upiLink)}`;
  }, [payment?.upiLink]);

  const currentUpiLink = useMemo(() => {
    if (!payment) return '';
    if (customAmount && parseFloat(customAmount) > 0) {
      const amount = parseFloat(customAmount);
      return `upi://pay?pa=${payment.upiId}&pn=${encodeURIComponent(payment.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(payment.notes || 'Payment')}`;
    }
    return payment.upiLink;
  }, [payment, customAmount]);

  const handleAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value && parseFloat(value) > 0 && payment) {
      const amount = parseFloat(value);
      const tempLink = `upi://pay?pa=${payment.upiId}&pn=${encodeURIComponent(payment.name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(payment.notes || 'Payment')}`;
      const tempQr = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(tempLink)}`;
      setTempQrUrl(tempQr);
    } else {
      setTempQrUrl('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t_toasts('linkCopied') });
  };
  
  const handleShare = async () => {
    const amountText = typeof payment?.amount === 'number' && payment.amount > 0
      ? ` of ₹${payment.amount.toFixed(2)}`
      : '';
    const shareData = {
      title: "UPI Payment Request",
      text: `${payment?.name} is requesting a payment${amountText}.`,
      url: window.location.href,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Sharing failed", error);
        copyToClipboard(window.location.href);
      }
    } else {
      copyToClipboard(window.location.href);
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
                <AlertTitle>{t('errorTitle')}</AlertTitle>
                <AlertDescription>
                    {t('errorDescription')}
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
                <AlertTitle>{t('expiredTitle')}</AlertTitle>
                <AlertDescription>
                    {t('expiredDescription')}
                </AlertDescription>
            </Alert>
        </div>
    );
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl">{t('title')}</CardTitle>
          <CardDescription>
            {t('description', {name: payment.name})}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center w-full">
                {typeof payment.amount === 'number' && payment.amount > 0 ? (
                  <p className="text-5xl font-bold tracking-tight">₹{payment.amount.toFixed(2)}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-muted-foreground">{t('enterAmount')}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl font-bold">₹</span>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={customAmount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="text-3xl font-bold text-center w-48 h-14"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                )}
                {payment.notes && <p className="text-muted-foreground mt-2">{payment.notes}</p>}
            </div>

          <div className="p-2 bg-white rounded-lg border shadow-md">
            {(tempQrUrl || qrCodeUrl) && <Image src={tempQrUrl || qrCodeUrl} alt={`UPI QR Code for payment to ${payment.name}`} width={256} height={256} key={tempQrUrl || qrCodeUrl} />}
          </div>

           <div className="w-full space-y-4">
                <Button asChild className="w-full text-lg py-6" disabled={!payment.amount && (!customAmount || parseFloat(customAmount) <= 0)}>
                    <a href={currentUpiLink}>
                        {t('payButton')}
                    </a>
                </Button>

                <div className="flex w-full gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(window.location.href)}>
                        <Copy className="mr-2 h-4 w-4" /> {t('copyLinkButton')}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" /> {t('sharePageButton')}
                    </Button>
                </div>
            </div>

            <div className="text-xs text-muted-foreground text-center">
                <p>{t('requestedTo')} <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{payment.upiId}</span></p>
                 <p>
                    {t('linkCreated', {timeAgo: formatDistanceToNow(toDate(payment.timestamp), { addSuffix: true })}) }
                </p>
                {payment.expiry && (
                     <p>
                        {t('expiresIn', {timeAgo: formatDistanceToNow(toDate(payment.expiry)) })}
                    </p>
                )}
            </div>
            <Separator className="w-full" />
            <div className="text-center text-xs text-muted-foreground space-y-2">
                <Link href={`/${params.locale || 'en'}`} className="text-sm text-primary hover:underline">
                    {t('createYourOwnLink')}
                </Link>
                <p>{t('poweredBy')}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
