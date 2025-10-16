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
import {useTranslations} from 'next-intl';

interface PaymentFormProps {
  user: User;
  onPaymentGenerated: (payment: PaymentRequest) => void;
}

export default function PaymentForm({ user, onPaymentGenerated }: PaymentFormProps) {
  const t = useTranslations('DashboardPage');
  const t_errors = useTranslations('Errors');
  const t_toasts = useTranslations('Toasts');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  const formSchema = z.object({
    name: z.string().min(1, { message: t_errors('nameRequired') }),
    upiId: z.string().min(5, { message: t_errors('upiIdRequired') }).regex(/@/, { message: t_errors('upiIdInvalid') }),
    amount: z.coerce.number().positive({ message: t_errors('amountPositive') }),
    notes: z.string().optional(),
  });

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
          title: t_toasts('error'),
          description: t_toasts('dbNotAvailable'),
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
      toast({ title: t_toasts('linkGenerated') });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('createTitle')}</CardTitle>
        <CardDescription>{t('createDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('amountLabel')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder={t('amountPlaceholder')} {...field} step="0.01" />
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
            <Button type="submit" className="w-full" disabled={loading || !firestore}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('generateButton')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
