import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">About UPI PG</CardTitle>
          <CardDescription>Instant, Sharable UPI Payment Links</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground">
            <p>
                Welcome to UPI PG, your go-to solution for generating UPI payment links in an instant. Our platform is designed for everyone - from freelancers and small business owners to individuals who need a quick way to request money without the hassle of sharing bank details or phone numbers.
            </p>
            <p>
                Our mission is to make digital payments as seamless and accessible as possible. With UPI PG, you can create a personalized payment page with a unique QR code and a direct payment link. This can be done anonymously for quick, one-time transactions, or you can create an account to track your payment history, manage your links, and access more features.
            </p>
            <h3 className="text-xl font-semibold">Key Features:</h3>
            <ul>
                <li><strong>No Login Required:</strong> Generate payment links on the fly without needing to create an account.</li>
                <li><strong>Customizable Links:</strong> Specify the amount, add notes, and even set an expiry date for your payment requests.</li>
                <li><strong>Sharable Pages:</strong> Each link generates a clean, professional payment page with a QR code and a button to pay via any UPI app.</li>
                <li><strong>User Dashboard:</strong> Sign up for a free account to view your payment history, mark payments as complete, and manage all your generated links in one place.</li>
                <li><strong>Secure & Private:</strong> We leverage the security of the UPI network. Your sensitive data is never stored on our servers, and we provide robust security rules to protect user information.</li>
            </ul>
            <p>
                UPI PG is built with modern, secure technology to ensure a reliable and safe experience. We are committed to continuously improving our platform and adding new features to serve you better.
            </p>
            <p>
                Thank you for choosing UPI PG. Create your first payment link today and experience the future of simple payments!
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
