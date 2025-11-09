"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Copy, Share2, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {useTranslations} from 'next-intl';
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function EmbedWidgetPage() {
  const t = useTranslations('EmbedPage');
  const t_errors = useTranslations('Errors');
  const t_toasts = useTranslations('Toasts');

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    name: string;
    upiId: string;
    amount: number | null;
    notes: string;
    upiLink: string;
  } | null>(null);

  const formSchema = z.object({
    name: z.string().min(1, { message: t_errors('nameRequired') }),
    upiId: z.string().min(5, { message: t_errors('upiIdRequired') }).regex(/@/, { message: t_errors('upiIdInvalid') }),
    amount: z.coerce.number().positive({ message: t_errors('amountPositive') }).optional().or(z.literal('')),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      upiId: "",
      amount: '' as any,
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { upiId, amount, name, notes } = values;
      const amountValue = amount && String(amount) !== '' ? Number(amount) : null;
      const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}${amountValue && amountValue > 0 ? `&am=${amountValue}` : ''}&cu=INR&tn=${encodeURIComponent(notes || 'Payment')}`;

      setGeneratedData({
        name,
        upiId,
        amount: amountValue,
        notes: notes || "",
        upiLink,
      });

      toast({ title: t_toasts('linkGenerated') });
    } catch (error) {
      console.error(error);
      toast({ title: t_toasts('error'), description: t_toasts('generationFailed'), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const qrCodeUrl = useMemo(() => {
    if (!generatedData?.upiLink) return "";
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(generatedData.upiLink)}`;
  }, [generatedData?.upiLink]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: t_toasts('linkCopied') });
  };

  const handleShare = async () => {
    if (!generatedData) return;
    
    const amountText = typeof generatedData.amount === 'number' && generatedData.amount > 0
      ? ` of ₹${generatedData.amount.toFixed(2)}`
      : '';
    const shareData = {
      title: "UPI Payment Request",
      text: `${generatedData.name} is requesting a payment${amountText}.`,
      url: generatedData.upiLink,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Sharing failed", error);
        copyToClipboard(generatedData.upiLink);
      }
    } else {
      copyToClipboard(generatedData.upiLink);
    }
  };

  const handleReset = () => {
    setGeneratedData(null);
    form.reset();
  };

  if (generatedData) {
    return (
      <div className="container mx-auto p-4 bg-transparent">
        <Card className="w-full max-w-lg mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('paymentReady')}</CardTitle>
            <CardDescription>
              {t('scanOrShare')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="text-center w-full">
              {typeof generatedData.amount === 'number' && generatedData.amount > 0 ? (
                <p className="text-4xl font-bold tracking-tight">₹{generatedData.amount.toFixed(2)}</p>
              ) : (
                <p className="text-lg font-semibold text-muted-foreground">{t('flexibleAmount')}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">{t('paymentTo')} {generatedData.name}</p>
              {generatedData.notes && <p className="text-sm text-muted-foreground mt-1">{generatedData.notes}</p>}
            </div>

            <div className="p-2 bg-white rounded-lg border shadow-md">
              {qrCodeUrl && <Image src={qrCodeUrl} alt={`UPI QR Code for payment to ${generatedData.name}`} width={256} height={256} />}
            </div>

            <div className="w-full space-y-3">
              <Button asChild className="w-full text-lg py-6">
                <a href={generatedData.upiLink}>
                  {t('payNow')}
                </a>
              </Button>

              <div className="flex w-full gap-2">
                <Button variant="outline" className="flex-1" onClick={() => copyToClipboard(generatedData.upiLink)}>
                  <Copy className="mr-2 h-4 w-4" /> {t('copyLink')}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" /> {t('share')}
                </Button>
              </div>
            </div>

            <Separator className="w-full" />

            <Button variant="ghost" onClick={handleReset} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('createAnother')}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              <p>{t('requestedTo')} <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{generatedData.upiId}</span></p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-transparent">
       <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            {t('widgetTitle')}
          </CardTitle>
          <CardDescription>
            {t('widgetDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <FormLabel>{t('amountLabel')} ({t('optional')})</FormLabel>
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
