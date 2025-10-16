
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
            Create Free UPI Payment Links Instantly
          </CardTitle>
          <CardDescription className="max-w-xl mx-auto pt-2 text-base">
            Welcome to UPI PG, the simplest way to request payments. Generate a unique, shareable UPI payment page and QR code in seconds. Perfect for freelancers, small businesses, and individuals.
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
                Generate Secure Payment Link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <section className="w-full max-w-4xl mt-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">The Power of Simplicity</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Receive payments without the complexity. Our platform is built for speed and ease of use.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary"><path d="M4 12a8 8 0 0 1 8-8 8 8 0 0 1 8 8M7 22l1-1-1-1M17 22l-1-1 1-1M12 2v2M2 7h2M20 7h2M4 17l2-2M20 17l-2-2M12 18a6 6 0 0 1-6-6h12a6 6 0 0 1-6 6Z"/></svg>
            <h3 className="mt-4 text-xl font-semibold">No Login Needed</h3>
            <p className="mt-1 text-muted-foreground">
              Generate links instantly. No sign-up required for one-time payments, making it friction-free for you and your payers.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <h3 className="mt-4 text-xl font-semibold">Secure and Private</h3>
            <p className="mt-1 text-muted-foreground">
              Leveraging the robust security of the UPI network. Create a free account to manage your links with enhanced privacy controls.
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
    </div>
  );
}
