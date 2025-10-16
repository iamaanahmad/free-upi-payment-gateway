
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
import {useTranslations} from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');
  const t_errors = useTranslations('Errors');
  const t_toasts = useTranslations('Toasts');
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, { message: t_errors('nameRequired') }),
    upiId: z.string().min(5, { message: t_errors('upiIdRequired') }).regex(/@/, { message: t_errors('upiIdInvalid') }),
    amount: z.coerce.number().positive({ message: t_errors('amountPositive') }),
    notes: z.string().optional(),
    expiry: z.date().optional(),
  });

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
      toast({ title: t_toasts('error'), description: t_toasts('dbNotAvailable'), variant: "destructive" });
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
        toast({ title: t_toasts('linkGenerated') });
        router.push(`/pay/${docRef.id}${user ? '' : '?public=true'}`);
      }
    } catch (error) {
      console.error(error);
      toast({ title: t_toasts('error'), description: t_toasts('generationFailed'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-12 flex items-center justify-center flex-col">
       <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {t('title')}
          </h1>
          <CardDescription className="max-w-xl mx-auto pt-2 text-base">
            {t('description')}
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
                      <FormLabel>{t('payeeNameLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('payeeNamePlaceholder')} {...field} />
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
                      <FormLabel>{t('upiIdLabel')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('upiIdPlaceholder')} {...field} />
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
                      <FormLabel>{t('amountLabel')}</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder={t('amountPlaceholder')} {...field} value={field.value || ''} step="0.01" />
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
                    <FormLabel>{t('notesLabel')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t('notesPlaceholder')} {...field} />
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
                    <FormLabel>{t('expiryLabel')}</FormLabel>
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
                              <span>{t('expiryPlaceholder')}</span>
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
                {t('generateButton')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <section className="w-full max-w-4xl mt-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('powerTitle')}</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('powerDescription')}
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary" aria-label={t('feature1Title')}><rect width="8" height="8" x="3" y="3" rx="1"/><path d="M7 11h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/><path d="M11 3v2"/><path d="M7 3v2"/><path d="m21 15-4-4"/><path d="M17 15h4v4"/><path d="M3 11v2"/><path d="M3 7h2"/></svg>
            <h3 className="mt-4 text-xl font-semibold">{t('feature1Title')}</h3>
            <p className="mt-1 text-muted-foreground">
              {t('feature1Description')}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary" aria-label={t('feature2Title')}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            <h3 className="mt-4 text-xl font-semibold">{t('feature2Title')}</h3>
            <p className="mt-1 text-muted-foreground">
              {t('feature2Description')}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary" aria-label={t('feature3Title')}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"></path></svg>
            <h3 className="mt-4 text-xl font-semibold">{t('feature3Title')}</h3>
            <p className="mt-1 text-muted-foreground">
              {t('feature3Description')}
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl mt-16">
        <h2 className="text-3xl font-bold tracking-tight text-center">{t('faqTitle')}</h2>
        <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="item-1">
                <AccordionTrigger>{t('faq1Question')}</AccordionTrigger>
                <AccordionContent>
                {t('faq1Answer')}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>{t('faq2Question')}</AccordionTrigger>
                <AccordionContent>
                {t('faq2Answer')}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>{t('faq3Question')}</AccordionTrigger>
                <AccordionContent>
                {t('faq3Answer')}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>{t('faq4Question')}</AccordionTrigger>
                <AccordionContent>
                {t('faq4Answer')}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
