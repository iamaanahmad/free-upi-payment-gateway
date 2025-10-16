
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card/80 border-t mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-muted-foreground mb-4 sm:mb-0">
          © {new Date().getFullYear()} UPI PG by CIT India.
        </p>
        <div className="flex gap-4 sm:gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
           <Link href="/developers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            For Developers
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
