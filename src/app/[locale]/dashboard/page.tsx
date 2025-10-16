"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import PaymentForm from "@/components/dashboard/payment-form";
import PaymentHistory from "@/components/dashboard/payment-history";
import PaymentDetailsDialog from "@/components/dashboard/payment-details-dialog";
import type { PaymentRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import {useTranslations} from 'next-intl';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [activePayment, setActivePayment] = useState<PaymentRequest | null>(null);
  const t = useTranslations('DashboardPage');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1 space-y-4">
                <Skeleton className="h-48 w-full" />
            </div>
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <PaymentForm user={user} onPaymentGenerated={setActivePayment} />
        </div>
        <div className="md:col-span-2">
          <PaymentHistory userId={user.uid} />
        </div>
      </div>
      <PaymentDetailsDialog
        payment={activePayment}
        isOpen={!!activePayment}
        onClose={() => setActivePayment(null)}
      />
    </div>
  );
}
