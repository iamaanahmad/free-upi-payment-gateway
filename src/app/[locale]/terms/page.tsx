import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground">
            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the UPI PG website (the "Service") operated by us.</p>
            
            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>

            <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

            <h3>Accounts</h3>
            <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>

            <h3>Generated Links</h3>
            <p>Our Service allows you to generate UPI payment links. You are responsible for the accuracy of the UPI ID and other information you provide. We are not a payment processor and do not handle any funds. We are not responsible for any transactions, disputes, or losses that may occur from the use of the generated links.</p>

            <h3>Intellectual Property</h3>
            <p>The Service and its original content, features, and functionality are and will remain the exclusive property of UPI PG and its licensors.</p>

            <h3>Links To Other Web Sites</h3>
            <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by UPI PG. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</p>

            <h3>Termination</h3>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
            
            <h3>Governing Law</h3>
            <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.</p>

            <h3>Changes</h3>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions about these Terms, please contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
