"use client";

import { useMemo } from "react";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { PaymentRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, CheckCircle, XCircle, Share2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { useRouter } from 'next/navigation';
import {useTranslations, useLocale} from 'next-intl';


interface PaymentHistoryProps {
  userId: string;
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const t = useTranslations('DashboardPage');
  const t_toasts = useTranslations('Toasts');
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();
  const locale = useLocale();

  const paymentsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(collection(firestore, `users/${userId}/paymentRequests`), orderBy("timestamp", "desc"));
  }, [firestore, userId]);
  
  const { data: payments, isLoading: loading } = useCollection<PaymentRequest>(paymentsQuery);

  const updateStatus = (id: string, status: "completed" | "failed") => {
    if (!firestore || !userId) return;
    const docRef = doc(firestore, `users/${userId}/paymentRequests`, id);
    updateDocumentNonBlocking(docRef, { status });
    toast({ title: status === 'completed' ? t_toasts('markedAsCompleted') : t_toasts('markedAsFailed') });
  };

  const deletePayment = (id: string) => {
    if (!firestore || !userId) return;
    const docRef = doc(firestore, `users/${userId}/paymentRequests`, id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: t_toasts('deleted') });
  }

  const shareLink = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    toast({ title: t_toasts('shareLinkCopied') });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent hover:bg-accent/90 text-accent-foreground">{t('statusCompleted')}</Badge>;
      case "failed":
        return <Badge variant="destructive">{t('statusFailed')}</Badge>;
      default:
        return <Badge variant="secondary">{t('statusPending')}</Badge>;
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t('historyTitle')}</CardTitle>
        <CardDescription className="text-base">{t('historyDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}
        {!loading && (!payments || payments.length === 0) && (
          <div className="text-center text-muted-foreground py-16 border-2 border-dashed rounded-lg">
            <p className="font-semibold">{t('noPayments')}</p>
            <p className="text-sm">{t('getStarted')}</p>
          </div>
        )}
        <div className="space-y-4">
          {payments && payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 md:p-5 border-2 rounded-lg hover:border-primary/50 hover:shadow-md transition-all bg-card">
                <div className="grid gap-1.5 flex-1 min-w-0">
                    <p className="font-semibold text-base md:text-lg truncate">₹{p.amount.toFixed(2)} {t('paymentTo', {name: p.name})}</p>
                    <p className="text-sm text-muted-foreground truncate">{p.upiId}</p>
                     {p.notes && <p className="text-xs text-muted-foreground italic line-clamp-2">{p.notes}</p>}
                    <p className="text-xs text-muted-foreground">
                        {p.timestamp ? format(new Date((p.timestamp as any).toDate ? (p.timestamp as any).toDate() : p.timestamp), 'MMM d, yyyy, h:mm a') : '...'}
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                  {getStatusBadge(p.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => router.push(`/${locale}/pay/${p.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t('actionViewPage')}
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => shareLink(p.id)}>
                        <Share2 className="mr-2 h-4 w-4" />
                        {t('actionShare')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => updateStatus(p.id, 'completed')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {t('actionMarkCompleted')}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(p.id, 'failed')}>
                        <XCircle className="mr-2 h-4 w-4" />
                        {t('actionMarkFailed')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="focus:bg-destructive/80 focus:text-destructive-foreground text-destructive" onClick={() => deletePayment(p.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('actionDelete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
