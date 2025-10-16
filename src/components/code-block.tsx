
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  content: string;
}

export function CodeBlock({ content }: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  return (
    <div className="relative my-4">
      <pre className="bg-muted text-muted-foreground p-4 rounded-lg overflow-x-auto text-sm">
        <code>{content}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={copyToClipboard}
      >
        {hasCopied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
    </div>
  );
}
