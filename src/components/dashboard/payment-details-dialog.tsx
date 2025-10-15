"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";
import type { PaymentRequest } from "@/lib/types";

interface PaymentDetailsDialogProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentDetailsDialog({ payment, isOpen, onClose }: PaymentDetailsDialogProps) {
  const { toast } = useToast();

  if (!payment) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(payment.upiLink)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(payment.upiLink);
    toast({ title: "Copied to clipboard!" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Link Ready</DialogTitle>
          <DialogDescription>Share this link or QR code to receive payment.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="p-2 bg-white rounded-lg border">
            <Image
              src={qrCodeUrl}
              alt="UPI QR Code"
              width={256}
              height={256}
            />
          </div>
          <div className="grid w-full gap-2">
            <Label htmlFor="upi-link">UPI Payment Link</Label>
            <div className="flex gap-2">
              <Input id="upi-link" value={payment.upiLink} readOnly />
              <Button type="button" size="icon" variant="outline" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
