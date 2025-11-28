import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/shared/logo"

export const metadata = {
    title: "Content Moderation Policy | Palnect",
    description: "Content Moderation Policy for Palnect platform",
}

export default function ContentModeration() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Logo />
                    <nav className="flex gap-4">
                        <Link href="/legal/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">
                            Terms of Service
                        </Link>
                        <Link href="/legal/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
                            Privacy Policy
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Content Moderation Policy</h1>
                    <p className="text-muted-foreground">Last updated: November 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-8">
                    {/* Prohibited Content */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Content</h2>
                        <p className="text-muted-foreground mb-4">
                            The following types of content are strictly prohibited on Palnect:
                        </p>

                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Copyrighted Material</h3>
                                <p>
                                    Content that violates intellectual property rights, including unauthorized sharing of copyrighted
                                    books, articles, or educational materials without proper licensing or attribution. Users must have the
                                    right to share any material they upload.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Hate Speech and Discrimination</h3>
                                <p>
                                    Content that promotes hatred, discrimination, or violence against individuals or groups based on race,
                                    ethnicity, gender, sexual orientation, religion, disability, or any other protected characteristic.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Explicit and Adult Content</h3>
                                <p>
                                    Pornographic, sexually explicit, or adult-oriented content is not permitted. Palnect is an educational
                                    platform intended for academic purposes only.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Spam and Misleading Content</h3>
                                <p>
                                    Spam messages, promotional content, misleading information, phishing attempts, malware, or any content
                                    designed to deceive users or disrupt platform functionality.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Personal Information Sharing</h3>
                                <p>
                                    Sharing of other users' personal information (email, phone number, home address, etc.) without
                                    consent. Doxxing and harassment through personal information disclosure are prohibited.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Exam Answers and Cheating Materials</h3>
                                <p>
                                    Sharing exam questions, answer keys, or content designed to facilitate academic dishonesty or
                                    cheating. Palnect promotes legitimate learning and academic integrity.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Enforcement Mechanism */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Enforcement and Disciplinary Actions</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">User Reporting System</h3>
                                <p>
                                    Users can report prohibited content through our in-app reporting feature. All reports are reviewed by
                                    our moderation team to determine if content violates our policies.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Manual Review Queue</h3>
                                <p>
                                    Reported content enters a manual review queue where trained moderators assess the validity of the
                                    report and determine appropriate action within 24-48 hours.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Automated Flagging (Future)</h3>
                                <p>
                                    We are implementing AI-powered automated flagging systems to detect prohibited content patterns and
                                    flag potentially violating content for immediate review.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Progressive Enforcement</h3>
                                <p>Violations are handled through a three-tier system:</p>
                                <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                                    <li>
                                        <strong>Warning:</strong> First-time minor violations result in a warning and content removal. Users
                                        are notified of the violation and given guidelines for compliance.
                                    </li>
                                    <li>
                                        <strong>Suspension:</strong> Repeated violations or serious first-time violations result in
                                        temporary account suspension (7-30 days). Users cannot access the platform during this period.
                                    </li>
                                    <li>
                                        <strong>Permanent Ban:</strong> Severe violations, repeated suspensions, or egregious behavior
                                        result in permanent account termination. Banned users cannot create new accounts.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Appeals */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Appeals Process</h2>

                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                If you believe your content was removed or your account was suspended in error, you can appeal the
                                decision within 30 days by contacting our support team at moderation@palnect.com with details about your
                                case. Our appeals team will review your submission and provide a final decision within 5 business days.
                            </p>
                        </div>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Report Content Violations</h2>
                        <p className="text-muted-foreground">
                            To report prohibited content, please use the report button on the specific resource or user profile, or
                            contact our moderation team at moderation@palnect.com with details about the violation.
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
