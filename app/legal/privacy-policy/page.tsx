import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Privacy Policy | Palnect",
  description: "Privacy Policy for Palnect platform",
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-foreground">
            Palnect
          </Link>
          <nav className="flex gap-4">
            <Link href="/legal/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/legal/content-moderation" className="text-sm text-muted-foreground hover:text-foreground">
              Content Moderation
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: November 2024</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* Data Collected */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data We Collect</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Account Information</h3>
                <p>
                  When you create a Palnect account, we collect: email address, full name, school/institution,
                  department, and year of study. This information is essential for verifying your identity and
                  personalizing your experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Usage Data</h3>
                <p>
                  We collect information about how you interact with our platform, including pages visited, features
                  used, resources accessed, time spent on pages, and mentorship activities. This helps us understand
                  user behavior and improve our services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Payment Information</h3>
                <p>
                  Payment data including credit card information is processed by Paystack and is not stored directly by
                  Palnect. We only store transaction records and payment status information for billing purposes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Uploaded Files</h3>
                <p>
                  Any PDF resources, documents, or files you upload to Palnect are stored securely on our servers. We
                  retain these files to provide platform services and allow other users to access shared resources.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Data</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Provide Services</h3>
                <p>
                  Your data is used to create your account, facilitate mentorship connections, process transactions, and
                  deliver all features of the Palnect platform.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Platform Improvements</h3>
                <p>
                  We analyze usage patterns and user behavior through analytics to identify areas for improvement,
                  optimize features, and enhance the overall user experience.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Communications</h3>
                <p>
                  We send transactional emails including account confirmations, password resets, payment receipts, and
                  important platform updates. We do not send marketing emails without your consent.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Data Protection Statement</h3>
                <p>
                  We do not sell, trade, or share your personal data with third parties for their marketing purposes.
                  Your privacy is important to us, and we maintain strict data protection standards.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Encryption</h3>
                <p>
                  All data transmitted between your device and our servers is encrypted using HTTPS/TLS protocols. This
                  ensures that your information is protected during transmission and cannot be intercepted.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Secure Storage</h3>
                <p>
                  Your data is stored in secure databases with industry-standard encryption. Access to databases is
                  restricted to authorized personnel only, and all access is logged and monitored.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Regular Backups</h3>
                <p>
                  We perform regular automated backups of all user data to prevent loss in case of technical failure.
                  Backup systems are encrypted and stored securely.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Account Control</h3>
                <p>
                  You can delete your account and associated data at any time by requesting account deletion through
                  your account settings. Upon deletion, we will remove all personal information within 30 days, except
                  where legally required to retain records.
                </p>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Paystack</h3>
                <p>
                  Payment processing is handled by Paystack. Please review their privacy policy at{" "}
                  <a href="https://paystack.com/privacy" className="text-primary hover:underline">
                    paystack.com/privacy
                  </a>{" "}
                  for information on how they handle your payment data.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Anthropic (AI Processing)</h3>
                <p>
                  AI-powered features use Anthropic's services for text summarization and analysis. Please review their
                  privacy policy at{" "}
                  <a href="https://www.anthropic.com" className="text-primary hover:underline">
                    anthropic.com
                  </a>{" "}
                  to understand how your data is processed.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Vercel Hosting</h3>
                <p>
                  Palnect is hosted on Vercel's infrastructure. Please review their privacy policy at{" "}
                  <a href="https://vercel.com/privacy" className="text-primary hover:underline">
                    vercel.com/privacy
                  </a>{" "}
                  for information on infrastructure-level data handling.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about this Privacy Policy or our data practices, please contact us at
              privacy@palnect.com
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Button variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="secondary">
            <Link href="/legal/terms-of-service">Read Terms of Service</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
