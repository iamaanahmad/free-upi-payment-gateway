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
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  upiId: z.string().min(5, { message: "Please enter a valid UPI ID." }).regex(/@/, { message: "Invalid UPI ID format." }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0." }),
  notes: z.string().optional(),
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
      name: user.displayName || "",
      upiId: "",
      amount: undefined,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const { upiId, amount, name, notes } = values;
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(notes || 'Payment')}`;
      
      if (!firestore) {
        toast({
          title: "Error",
          description: "Firestore is not initialized.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const paymentsRef = collection(firestore, `users/${user.uid}/paymentRequests`);

      const docRefPromise = addDocumentNonBlocking(paymentsRef, {
        userId: user.uid,
        name,
        upiId,
        amount,
        notes: notes || "",
        status: "pending",
        timestamp: serverTimestamp(),
        upiLink,
      });

      const docRef = await docRefPromise;

      const newPayment: PaymentRequest = {
        id: docRef.id,
        userId: user.uid,
        name,
        upiId,
        amount,
        notes: notes || "",
        status: "pending",
        timestamp: new Date(), 
        upiLink,
      };

      onPaymentGenerated(newPayment);
      form.reset({
        ...form.getValues(),
        amount: undefined,
        notes: '',
        upiId: ''
      });
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
        <CardDescription>Enter the details to generate a new payment link.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payee Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    <Input type="number" placeholder="100.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="For coffee at the cafe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" className="w-full" disabled={loading || !firestore}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Link
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
