"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { collection, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore, addDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { PaymentRequest } from "@/lib/types";


const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  upiId: z.string().min(5, { message: "Please enter a valid UPI ID." }).regex(/@/, { message: "Invalid UPI ID format." }),
  amount: z.coerce.number().positive({ message: "Amount must be greater than 0." }),
  notes: z.string().optional(),
  expiry: z.date().optional(),
});


export default function Home() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      upiId: "",
      amount: undefined,
      notes: "",
      expiry: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    if (!firestore) {
      toast({ title: "Error", description: "Database not available.", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { upiId, amount, name, notes, expiry } = values;
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(notes || 'Payment')}`;
      
      const collectionPath = user ? `users/${user.uid}/paymentRequests` : 'publicPaymentRequests';
      const paymentsRef = collection(firestore, collectionPath);

      const docRefPromise = addDocumentNonBlocking(paymentsRef, {
        userId: user?.uid || null,
        name,
        upiId,
        amount,
        notes: notes || "",
        status: "pending",
        timestamp: serverTimestamp(),
        expiry: expiry || null,
        upiLink,
      });

      const docRef = await docRefPromise;
      
      toast({ title: "Payment link generated!" });
      router.push(`/pay/${docRef.id}${user ? '' : '?public=true'}`);

    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to generate payment link.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center">
       <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl">Instant UPI Payment Links</CardTitle>
          <CardDescription>Generate and share UPI payment links in seconds. No login required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
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
                      <FormLabel>UPI ID</FormLabel>
                      <FormControl>
                        <Input placeholder="your-name@upi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <FormField
                control={form.control}
                name="expiry"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiry Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0)) 
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                Generate Payment Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
