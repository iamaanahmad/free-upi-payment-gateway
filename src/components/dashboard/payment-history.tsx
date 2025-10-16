"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, where, orderBy, doc } from "firebase/firestore";
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
import { MoreVertical, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";
import { useCollection, useFirestore, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";

interface PaymentHistoryProps {
  userId: string;
}

export default function PaymentHistory({ userId }: PaymentHistoryProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const paymentsQuery = useMemoFirebase(() => {
    if (!userId) return null;
    return query(collection(firestore, `users/${userId}/paymentRequests`), orderBy("timestamp", "desc"));
  }, [firestore, userId]);
  
  const { data: payments, isLoading: loading } = useCollection<PaymentRequest>(paymentsQuery);

  const updateStatus = (id: string, status: "completed" | "failed") => {
    const docRef = doc(firestore, `users/${userId}/paymentRequests`, id);
    updateDocumentNonBlocking(docRef, { status });
    toast({ title: `Marked as ${status}` });
  };

  const deletePayment = (id: string) => {
    const docRef = doc(firestore, `users/${userId}/paymentRequests`, id);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Payment request deleted." });
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent hover:bg-accent/90 text-accent-foreground">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>A real-time list of your generated payment links.</CardDescription>
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
            <p className="font-semibold">You haven&apos;t created any payment links yet.</p>
            <p className="text-sm">Use the form to get started!</p>
          </div>
        )}
        <div className="space-y-4">
          {payments && payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-card transition-colors">
                <div className="grid gap-1">
                    <p className="font-semibold text-lg">₹{p.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{p.upiId}</p>
                    <p className="text-xs text-muted-foreground">
                        {p.timestamp ? format(new Date((p.timestamp as any).toDate ? (p.timestamp as any).toDate() : p.timestamp), 'MMM d, yyyy, h:mm a') : '...'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(p.status)}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(p.id, 'completed')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(p.id, 'failed')}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Mark as Failed
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="focus:bg-destructive/80 focus:text-destructive-foreground text-destructive" onClick={() => deletePayment(p.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
