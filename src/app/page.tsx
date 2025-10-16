
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


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

      const docRef = await addDocumentNonBlocking(paymentsRef, {
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

      if (docRef?.id) {
        toast({ title: "Payment link generated!" });
        router.push(`/pay/${docRef.id}${user ? '' : '?public=true'}`);
      } else {
        // The error is handled by the global error handler, but we should stop loading.
        // A toast will be shown by the error handler if configured.
      }


    } catch (error) {
      // This catch block might not be hit if non-blocking function handles it,
      // but it's good practice to keep it for other potential errors.
      console.error(error);
      toast({ title: "Error", description: "Failed to generate payment link.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center flex-col">
       <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Free UPI QR Code & Payment Link Generator
          </CardTitle>
          <CardDescription className="max-w-xl mx-auto pt-2 text-base">
            Welcome to UPI PG, the best and simplest tool to generate free UPI payment links and QR codes with a custom amount. Perfect for freelancers, small businesses, and individuals across India.
          </CardDescription>
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
                        <Input placeholder="Your or your business name" {...field} />
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
                        <Input placeholder="your-id@bank" {...field} />
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
                        <Input type="number" placeholder="100.00" {...field} value={field.value || ''} step="0.01" />
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
                    <FormLabel>Payment Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="E.g., for project consultation, coffee, etc." {...field} />
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
                    <FormLabel>Link Expiry Date (Optional)</FormLabel>
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
                              <span>Pick a date for the link to expire</span>
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
                Generate Secure Payment Link & QR Code
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <section className="w-full max-w-4xl mt-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">The Power of Simplicity for India's Digital Payments</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Receive payments without the complexity. Our platform leverages the full potential of BHIM UPI for speed and ease of use.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary"><rect width="8" height="8" x="3" y="3" rx="1"/><path d="M7 11h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/><path d="M11 3v2"/><path d="M7 3v2"/><path d="m21 15-4-4"/><path d="M17 15h4v4"/><path d="M3 11v2"/><path d="M3 7h2"/></svg>
            <h3 className="mt-4 text-xl font-semibold">QR Code with Amount</h3>
            <p className="mt-1 text-muted-foreground">
              Generate a unique UPI QR code for your specific amount. Your payers just scan and pay, no amount entry needed.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <h3 className="mt-4 text-xl font-semibold">Secure and Private</h3>
            <p className="mt-1 text-muted-foreground">
              Leveraging the NPCI & BHIM UPI network. Sign up for a free account to manage your links with enhanced privacy controls.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
            <h3 className="mt-4 text-xl font-semibold">Dashboard for Users</h3>
            <p className="mt-1 text-muted-foreground">
              Sign up to track payment history, manage all your links, and see real-time status updates in a personal dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl mt-16">
        <h2 className="text-3xl font-bold tracking-tight text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is this service really free?</AccordionTrigger>
                <AccordionContent>
                Yes, UPI PG is completely free for generating individual payment links. We believe in making payments simple and accessible for everyone.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Do I need a bank account to use this?</AccordionTrigger>
                <AccordionContent>
                You need a UPI ID, which is linked to your bank account via an app like Google Pay, PhonePe, Paytm, or your bank's own BHIM UPI app. Our service generates a link or QR code that the payer uses; we never ask for your bank account details.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Can I generate a UPI QR code without an amount?</AccordionTrigger>
                <AccordionContent>
                Currently, our tool is designed as a UPI QR code generator with amount included to simplify the payment process. You must specify an amount to generate a link.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>Is this an official NPCI or BHIM UPI QR code generator?</AccordionTrigger>
                <AccordionContent>
                We are an independent platform that uses the standard UPI protocol defined by NPCI. We provide a simple interface to create payment links and QR codes that work across the entire UPI network.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
