import { Users, Bot, GraduationCap, Share2, Brain, BookOpen, Zap } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Peer Learning Communities",
    description:
      "Join study groups with students from your field. Share notes, discuss topics, and grow together through collaboration.",
  },
  {
    icon: GraduationCap,
    title: "Mentorship Made Simple",
    description:
      "Connect with verified mentors who guide you through academics, career decisions, and personal development.",
  },
  {
    icon: Bot,
    title: "AI Study Assistant",
    description:
      "Get personalized AI support for your assignments, explanations, and summaries tailored to your study level and goals.",
  },
  {
    icon: Share2,
    title: "Resource Sharing Hub",
    description:
      "Upload and access curated materials, lecture notes, and past questions shared by students and mentors worldwide.",
  },
  {
    icon: Brain,
    title: "Smart Study Insights",
    description:
      "Track progress, identify weak areas, and receive AI-powered study suggestions to help you learn smarter every day.",
  },
  {
    icon: BookOpen,
    title: "All-in-One Learning Space",
    description:
      "Everything you need to study, connect, and grow brought together on one clean, intuitive platform built for students.",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="scroll-mt-17 overflow-hidden pt-17.5 lg:pt-22.5 xl:pt-27.5"
    >
      <div className="mx-auto max-w-[1222px] px-4 sm:px-8 xl:px-0">
        {/* Section Header */}
        <div className="relative z-10 mb-16 text-center">
          <span className="dark:bg-white/10 relative mb-5 inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-medium">
            <Zap className="h-3 w-3 text-primary" />
            <span className="hero-subtitle-text">Core Features</span>
          </span>
          <h2 className="mb-4.5 text-2xl font-extrabold dark:text-white sm:text-4xl xl:text-5xl">
            What Is Palnect All About?
          </h2>
          <p className="mx-auto max-w-[714px] font-medium text-muted-foreground">
            Everything students and mentors need to connect, learn, and grow with AI at the center of it all.
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          <div className="features-row-border absolute left-1/2 top-1/2 hidden h-[1px] w-1/2 -translate-y-1/2 rotate-90 lg:left-1/4 lg:block lg:-translate-x-1/3"></div>
          <div className="features-row-border absolute right-1/2 top-1/2 hidden h-[1px] w-1/2 -translate-y-1/2 rotate-90 lg:right-[8.3%] lg:block"></div>

          {/* Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center">
            {features.map((feature, index) => (
              <div key={index} className="">
                <div className="group relative overflow-hidden px-4 py-8 text-center sm:py-10 lg:px-8 xl:px-13 xl:py-15 transition-all duration-300">
                  <span className="features-bg absolute left-0 top-0 -z-1 h-full w-full opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></span>
                  <span className="bg-primary/10 relative mx-auto mb-8 inline-flex h-20 w-full max-w-[80px] items-center justify-center rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </span>
                  <h3 className="mb-4 text-lg font-semibold dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="font-medium leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="features-row-border h-[1px] w-full"></div>

          {/* Bottom Row */}
          {/* <div className="flex flex-wrap justify-center">
            {features.slice(3, 6).map((feature, index) => (
              <div key={index} className="w-full sm:w-1/2 lg:w-1/3 border border-border">
                <div className="group relative overflow-hidden px-4 py-8 text-center sm:py-10 lg:px-8 xl:px-13 xl:py-15 transition-all duration-300">
                  <span className="features-bg absolute left-0 top-0 -z-1 h-full w-full opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 rotate-180"></span>
                  <span className="bg-primary/10 relative mx-auto mb-8 inline-flex h-20 w-full max-w-[80px] items-center justify-center rounded-full">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </span>
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="font-medium text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
