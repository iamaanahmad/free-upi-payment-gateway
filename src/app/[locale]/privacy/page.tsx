import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <Card className="max-w-4xl mx-auto shadow-lg border-2">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl md:text-4xl">Privacy Policy</CardTitle>
          <CardDescription className="text-base">Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-stone dark:prose-invert max-w-none text-foreground space-y-4">
            <p>Your privacy is important to us. It is UPI PG's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            
            <h3>Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. For registered users, we collect your email address and display name. For all users, we temporarily process the data you enter to generate a UPI payment link, such as UPI ID, name, and amount. This information is stored in our database to provide the payment page and history functionality.</p>
            
            <h3>How We Use Your Information</h3>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Create and manage your account</li>
                <li>Generate and display payment links and pages</li>
                <li>Understand and analyze how you use our website</li>
            </ul>

            <h3>Log Data</h3>
            <p>Like many site operators, we collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>

            <h3>Cookies</h3>
            <p>We use cookies to store information including your preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
            
            <h3>Data Security</h3>
            <p>We use Firebase Authentication and Firestore Security Rules to protect your information. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.</p>
            
            <h3>Your Consent</h3>
            <p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>

            <h3>Changes to This Privacy Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h3>Contact Us</h3>
            <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
        </CardContent>
      </Card>
    </div>
  );
}
