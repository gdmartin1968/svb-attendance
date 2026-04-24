import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Users,
  ClipboardList,
  Shield,
  Image,
  Activity,
  School,
  ExternalLink,
  Table,
} from "lucide-react";

const activeRosters = [
  {
    name: "Ambassadors",
    url: "/svb/rosters/ambassadors-today.html",
    description: "Tennis Ambassador program",
  },
  {
    name: "Junior Ambassadors",
    url: "/svb/rosters/juniors-today.html",
    description: "Junior Ambassador program",
  },
  {
    name: "Stewart Tennis - 2pm, MW",
    url: "/svb/rosters/stewart-today.html",
    description: "Stewart Tennis roster",
  },
  {
    name: "Watergrass Elementary - 4pm, MW",
    url: "/svb/rosters/watergrass-today.html",
    description: "Watergrass Elementary roster",
  },
  {
    name: "Woodland Tiny Tennis - 2:45pm, TTh",
    url: "/svb/rosters/woodland-tiny-tennis-today.html",
    description: "Woodland Tiny Tennis roster",
  },
  {
    name: "West Zephyrhills Elementary - 4pm, TTh",
    url: "/svb/rosters/westzephyrhills-today.html",
    description: "West Zephyrhills Elementary roster",
  },
];

const features = [
  {
    icon: School,
    title: "Multi-School Support",
    description:
      "Manage multiple schools and locations from a single dashboard with organized hierarchies.",
  },
  {
    icon: ClipboardList,
    title: "Roster Management",
    description:
      "Create and manage 16+ rosters per year with seasonal organization and coach assignments.",
  },
  {
    icon: Users,
    title: "Student Tracking",
    description:
      "Track 500+ students per year with comprehensive profiles, photos, and history.",
  },
  {
    icon: Image,
    title: "Photo Management",
    description:
      "Upload and organize student photos with gallery views and batch upload support.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Admin, coach, and viewer roles with granular permissions for secure data access.",
  },
  {
    icon: Activity,
    title: "Activity Logging",
    description:
      "Track all changes with detailed audit logs for oversight and accountability.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
              TA
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">
              Tennis Academy
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild data-testid="button-login">
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="container max-w-screen-2xl px-4 md:px-8 py-16 md:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                  Roster Management
                  <span className="block text-primary">Made Simple</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  The complete solution for tennis academies to manage schools,
                  rosters, students, and coaching staff. Built for scale,
                  designed for simplicity.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild data-testid="button-get-started">
                  <a href="/api/login">Get Started</a>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  data-testid="button-learn-more"
                >
                  <a href="#features">Learn More</a>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Secure Access
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  500+ Students
                </span>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="w-64 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-4">
                <div className="h-full w-full rounded-lg bg-card border border-card-border p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="h-2 w-16 bg-muted rounded" />
                      <div className="h-1.5 w-10 bg-muted/60 rounded mt-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted/40 rounded" />
                    <div className="h-6 bg-muted/40 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="rosters" className="border-t border-border bg-primary/5">
          <div className="container max-w-screen-2xl px-4 md:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
                Active Rosters
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Quick access to current attendance tracking rosters.
              </p>
              <a
                href="https://docs.google.com/spreadsheets/d/1QwTcf4fK2jyynAfDkzPtYzztCTUmsBZflrFxsio5yxE/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
                data-testid="link-google-sheets"
              >
                <Table className="h-4 w-4" />
                Open Google Sheets Database
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {activeRosters.map((roster) => (
                <a
                  key={roster.name}
                  href={roster.url}
                  className="group block"
                  data-testid={`link-roster-${roster.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Card className="bg-background hover-elevate transition-all duration-200 h-full">
                    <CardContent className="p-6 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{roster.name}</h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {roster.description}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-border bg-muted/30">
          <div className="container max-w-screen-2xl px-4 md:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl mb-4">
                Everything You Need
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A comprehensive platform built specifically for tennis academies
                to streamline roster management and student tracking.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="bg-background hover-elevate transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container max-w-screen-2xl px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                TA
              </div>
              <span className="text-sm text-muted-foreground">
                Tennis Academy Roster Manager
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
