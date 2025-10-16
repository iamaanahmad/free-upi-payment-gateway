
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {useTranslations} from 'next-intl';

export default function EmbedPage() {
  const t = useTranslations('EmbedPage');
  const t_errors = useTranslations('Errors');
  const t_toasts = useTranslations('Toasts');

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
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

      const collectionPath = 'publicPaymentRequests';
      const paymentsRef = collection(firestore, collectionPath);

      const docRef = await addDocumentNonBlocking(paymentsRef, {
        userId: null,
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
        window.open(`/pay/${docRef.id}?public=true`, '_blank');
      }
    } catch (error) {
      console.error(error);
      toast({ title: t_toasts('error'), description: t_toasts('generationFailed'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container mx-auto p-4 bg-transparent">
       <Card className="w-full max-w-2xl shadow-none border-0 bg-transparent">
        <CardHeader className="text-center px-0">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
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
                        <Input type="number" placeholder={t('amountPlaceholder')} {...field} value={field.value ?? ""} step="0.01" />
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
    </div>
  );
}
