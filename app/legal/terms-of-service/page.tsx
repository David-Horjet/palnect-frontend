import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/shared/logo"

export const metadata = {
  title: "Terms of Service | Palnect",
  description: "Terms of Service for Palnect platform",
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <nav className="flex gap-4">
            <Link href="/legal/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: November 2025</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* User Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibilities</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Age Requirements</h3>
                <p>
                  Users must be 18 years or older to use Palnect. If you are under 18, you may use the platform only
                  with parental consent and under parental supervision.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Content Ownership</h3>
                <p>
                  You retain full ownership of any content you upload to Palnect. However, by uploading content, you
                  grant Palnect a worldwide, non-exclusive, royalty-free license to display, distribute, and store your
                  content for platform operations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Copyright Compliance</h3>
                <p>
                  You are responsible for ensuring that all content you upload does not infringe on any third-party
                  copyrights, trademarks, or intellectual property rights. You must have the right to share any content
                  you post on Palnect.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Prohibited Content</h3>
                <p>
                  You agree not to upload, share, or distribute any illegal, harmful, threatening, abusive, harassing,
                  defamatory, or obscene content. This includes content that promotes discrimination, violence, or harm
                  against any individual or group.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Respectful Conduct</h3>
                <p>
                  Harassment, bullying, intimidation, or abusive behavior toward other users is strictly prohibited. We
                  are committed to maintaining a safe and respectful community for all members.
                </p>
              </div>
            </div>
          </section>

          {/* Platform Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Platform Rights</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Content Removal</h3>
                <p>
                  Palnect reserves the right to remove, suspend, or restrict access to any content that violates these
                  Terms of Service, our community guidelines, or applicable laws, without prior notice.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Account Suspension and Termination</h3>
                <p>
                  We reserve the right to suspend or terminate user accounts that violate our policies or engage in
                  harmful behavior. Users may be banned from the platform at our discretion.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Service Modifications</h3>
                <p>
                  Palnect may modify, update, or discontinue any features, functionality, or pricing at any time. We
                  will make reasonable efforts to notify users of significant changes.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Refunds on Points</h3>
                <p>
                  All points purchases are final and non-refundable. Points have no monetary value and cannot be
                  exchanged for cash or other consideration outside the Palnect platform.
                </p>
              </div>
            </div>
          </section>

          {/* Limitations of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Limitations of Liability</h2>

            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">As-Is Service</h3>
                <p>
                  Palnect is provided "as is" without warranties of any kind, express or implied. We do not guarantee
                  that the platform will be error-free, uninterrupted, or secure.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Mentorship Quality</h3>
                <p>
                  Palnect does not guarantee the quality, accuracy, or reliability of mentorship services provided by
                  mentors. Users are responsible for evaluating the credibility and qualifications of mentors before
                  engaging with them.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">User Interactions</h3>
                <p>
                  Palnect is not responsible for disputes, conflicts, or outcomes arising from interactions between
                  users, mentors, and students. All interactions occur at users' own risk.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Third-Party Payment Processing</h3>
                <p>
                  Palnect uses Paystack for payment processing. We are not liable for any issues, failures, or
                  unauthorized charges resulting from third-party payment processing services.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at support@palnect.com
            </p>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 pt-8 border-t border-border flex gap-4">
          <Button variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button variant="secondary">
            <Link href="/legal/privacy-policy">Read Privacy Policy</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
