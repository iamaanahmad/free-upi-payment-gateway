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
import { Copy, Share2 } from "lucide-react";
import type { PaymentRequest } from "@/lib/types";

interface PaymentDetailsDialogProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onClose: () => void;
  isPublic?: boolean;
}

export default function PaymentDetailsDialog({ payment, isOpen, onClose, isPublic = false }: PaymentDetailsDialogProps) {
  const { toast } = useToast();

  if (!payment) return null;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(payment.upiLink)}`;
  const shareableLink = `${window.location.origin}/pay/${payment.id}${isPublic ? '?public=true' : ''}`;


  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copied to clipboard!` });
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
          <div className="grid w-full gap-4">
            <div className="grid gap-2">
              <Label htmlFor="upi-link">UPI Payment Link</Label>
              <div className="flex gap-2">
                <Input id="upi-link" value={payment.upiLink} readOnly />
                <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(payment.upiLink, 'UPI Link')}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy UPI link</span>
                </Button>
              </div>
            </div>
             <div className="grid gap-2">
              <Label htmlFor="share-link">Shareable Page Link</Label>
              <div className="flex gap-2">
                <Input id="share-link" value={shareableLink} readOnly />
                <Button type="button" size="icon" variant="outline" onClick={() => copyToClipboard(shareableLink, 'Shareable Link')}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Copy Shareable link</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
