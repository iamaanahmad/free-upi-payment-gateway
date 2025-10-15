import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter font-headline text-primary">
            Instant UPI Payments.
            <br />
            Simplified.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Generate and share UPI payment links in seconds. Get paid faster with UPI Linker, the simplest way to accept payments without a backend.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          {heroImage && (
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="rounded-xl shadow-2xl"
                data-ai-hint={heroImage.imageHint}
              />
          )}
        </div>
      </div>
    </div>
  );
}
