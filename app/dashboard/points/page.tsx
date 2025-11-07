"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Zap, History, ArrowDown, ArrowUp, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

interface PointsPackage {
  id: string
  naira: number
  points: number
  bonus: number
  popular?: boolean
}

interface Transaction {
  id: string
  type: "purchase" | "mentorship_subscription" | "resource_download" | "mentorship_reward"
  description: string
  amount: number
  date: string
  status: "completed" | "pending"
}

export default function PointsPage() {
  const [currentBalance] = useState(420)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const packages: PointsPackage[] = [
    {
      id: "1",
      naira: 100,
      points: 10,
      bonus: 0,
    },
    {
      id: "2",
      naira: 500,
      points: 55,
      bonus: 5,
      popular: true,
    },
    {
      id: "3",
      naira: 1000,
      points: 115,
      bonus: 15,
    },
    {
      id: "4",
      naira: 2000,
      points: 240,
      bonus: 40,
      popular: true,
    },
  ]

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "purchase",
      description: "Points Purchase - 55 points",
      amount: 55,
      date: "2 days ago",
      status: "completed",
    },
    {
      id: "2",
      type: "mentorship_subscription",
      description: "Subscription - Sarah Chen (Weekly)",
      amount: -2500,
      date: "5 days ago",
      status: "completed",
    },
    {
      id: "3",
      type: "resource_download",
      description: "Resource Download Fee",
      amount: -50,
      date: "1 week ago",
      status: "completed",
    },
    {
      id: "4",
      type: "mentorship_reward",
      description: "Mentorship Earnings - 2 student subscriptions",
      amount: 1500,
      date: "1 week ago",
      status: "completed",
    },
    {
      id: "5",
      type: "purchase",
      description: "Points Purchase - 115 points",
      amount: 115,
      date: "2 weeks ago",
      status: "completed",
    },
  ]

  const handlePurchase = () => {
    if (selectedPackage) {
      alert("Redirecting to Paystack payment...")
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="points" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Points & Purchases" subtitle="Manage your points balance and transaction history" />

        <div className="p-6 space-y-8 max-w-5xl">
          {/* Current Balance */}
          <Card className="bg-linear-to-br from-primary/20 via-accent/20 to-primary/10 border-primary/30 p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-muted-foreground mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Your Current Balance
                </p>
                <p className="text-4xl font-bold text-foreground mb-2">{currentBalance} Points</p>
                <p className="text-sm text-muted-foreground">Use points to subscribe to mentors and unlock services</p>
              </div>
              <Button size="lg" className="self-start">
                Buy More Points
              </Button>
            </div>
          </Card>

          {/* Points Packages */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-foreground">Choose Your Package</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`p-6 cursor-pointer transition-all relative ${
                    selectedPackage === pkg.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary"
                      : "hover:border-primary/50"
                  } ${pkg.popular ? "ring-1 ring-accent" : ""}`}
                //   onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && <Badge className="absolute top-2 right-2 bg-accent text-foreground">Popular</Badge>}

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-2xl font-bold text-foreground">₦{pkg.naira}</p>
                    </div>

                    <div className="pt-3 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-1">You Get</p>
                      <div className="space-y-1">
                        <p className="font-bold text-lg text-primary">{pkg.points} Points</p>
                        {pkg.bonus > 0 && (
                          <p className="text-xs text-accent font-semibold">
                            +{pkg.bonus} Bonus ({Math.round((pkg.bonus / pkg.points) * 100)}% extra)
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground pt-2">
                      {Math.round((pkg.points / pkg.naira) * 100) / 100} pts per naira
                    </p>
                  </div>
                </Card>
              ))}
            </div>

            {selectedPackage && (
              <div className="mt-6">
                <Card className="p-6 bg-muted/50 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Package</p>
                      <div>
                        {packages.find((p) => p.id === selectedPackage) && (
                          <>
                            <p className="text-2xl font-bold text-foreground">
                              ₦{packages.find((p) => p.id === selectedPackage)?.naira}
                            </p>
                            <p className="text-sm text-accent">
                              {packages.find((p) => p.id === selectedPackage)?.points} Points
                              {(packages.find((p) => p.id === selectedPackage)?.bonus || 0) > 0 &&
                                ` + ${packages.find((p) => p.id === selectedPackage)?.bonus} Bonus`}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <Button size="lg" onClick={handlePurchase}>
                      Proceed to Payment
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payments are powered by Paystack. Your transaction will be secure and verified.
                  </p>
                </Card>
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <History className="h-6 w-6" />
                Transaction History
              </h2>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>

            <Card>
              <div className="space-y-0">
                {transactions.map((tx, idx) => (
                  <div
                    key={tx.id}
                    className={`p-4 flex items-start justify-between gap-4 ${
                      idx !== transactions.length - 1 ? "border-b border-border/50" : ""
                    } hover:bg-muted/50 transition-colors`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${tx.amount > 0 ? "bg-primary/10" : "bg-destructive/10"}`}>
                        {tx.amount > 0 ? (
                          <ArrowDown className={`h-4 w-4 text-primary`} />
                        ) : (
                          <ArrowUp className={`h-4 w-4 text-destructive`} />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          {tx.date}
                          {tx.status === "completed" && (
                            <>
                              •
                              <CheckCircle className="h-3 w-3 text-primary" />
                              Completed
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-lg font-bold ${tx.amount > 0 ? "text-primary" : "text-destructive"}`}>
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.type === "purchase"
                          ? "Purchase"
                          : tx.type === "mentorship_subscription"
                            ? "Subscription"
                            : tx.type === "mentorship_reward"
                              ? "Earnings"
                              : "Fee"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Points Usage Guide */}
          <Card className="p-6 bg-muted/50 border-border/50">
            <h3 className="text-lg font-bold mb-4 text-foreground">How Points Work</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Badge className="mb-2 bg-primary/20 text-primary">Get Points</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Purchase points with Paystack</li>
                  <li>• Earn from mentoring students</li>
                  <li>• Get 10 welcome points on signup</li>
                </ul>
              </div>
              <div>
                <Badge className="mb-2 bg-accent/20 text-accent">Use Points</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Subscribe to mentors (daily/weekly/monthly)</li>
                  <li>• Unlock premium resources</li>
                  <li>• Access exclusive content</li>
                </ul>
              </div>
              <div>
                <Badge className="mb-2 bg-destructive/20 text-destructive">Note</Badge>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Points are non-refundable</li>
                  <li>• Unused points expire after 1 year</li>
                  <li>• Subscriptions auto-expire on due date</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
