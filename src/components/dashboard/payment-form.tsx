"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PaymentRequest } from "@/lib/types";
import { useFirestore, addDocumentNonBlocking } from "@/firebase";

const formSchema = z.object({
  upiId: z.string().min(5, { message: "Please enter a valid UPI ID." }).regex(/@/, { message: "Invalid UPI ID format." }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0." }),
});

interface PaymentFormProps {
  user: User;
  onPaymentGenerated: (payment: PaymentRequest) => void;
}

export default function PaymentForm({ user, onPaymentGenerated }: PaymentFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      upiId: "",
      amount: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { upiId, amount } = values;
      const upiLink = `upi://pay?pa=${upiId}&pn=${user.displayName || user.email}&am=${amount}&tn=Payment via UPI Linker`;
      
      const paymentsRef = collection(firestore, `users/${user.uid}/paymentRequests`);

      const docRefPromise = addDocumentNonBlocking(paymentsRef, {
        userId: user.uid,
        upiId,
        amount,
        status: "pending",
        timestamp: serverTimestamp(),
        upiLink,
      });

      const docRef = await docRefPromise;

      const newPayment: PaymentRequest = {
        id: docRef.id,
        userId: user.uid,
        upiId,
        amount,
        status: "pending",
        timestamp: new Date(), 
        upiLink,
      };

      onPaymentGenerated(newPayment);
      form.reset();
      toast({ title: "Payment link generated!" });
    } catch (error) {
      // Error is handled by the non-blocking update function and global error listener
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Payment Link</CardTitle>
        <CardDescription>Enter UPI ID and amount to generate a link.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your UPI ID</FormLabel>
                  <FormControl>
                    <Input placeholder="your-name@upi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (INR)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Link
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
