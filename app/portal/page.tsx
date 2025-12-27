"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Map, Users, Trophy, CalendarDays, Camera } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-amber-50/20 to-orange-50/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Map size={24} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Kolkata Explorer</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              Discover Kolkata's Hidden{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Heritage</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore historic landmarks, discover authentic restaurants, meet fellow travelers, and unlock exclusive
              rewards through immersive cultural quests.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/explore">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Exploring
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="relative h-96">
            <img
              src="/kolkata-heritage-victoria-memorial.jpg"
              alt="Kolkata Heritage"
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Explore, Connect & Discover</h2>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            {
              icon: Map,
              title: "Heritage Map",
              description: "Interactive map of Kolkata's most iconic sites",
              href: "/explore",
              comingSoon: false,
            },
            {
              icon: Camera,
              title: "Share Your Culture & Heritage",
              description: "Submit your cultural moments and earn points",
              href: "/culture",
              comingSoon: false,
            },
            {
              icon: Users,
              title: "Travel Matching",
              description: "Find like-minded travel companions",
              href: "/matches",
              comingSoon: true,
            },
            {
              icon: CalendarDays,
              title: "Trip Planner",
              description: "Build your perfect Kolkata itinerary",
              href: "/planner",
              comingSoon: false,
            },
            {
              icon: Trophy,
              title: "Gamified Quests",
              description: "Unlock badges and exclusive rewards",
              href: "/achievements",
              comingSoon: false,
            },
          ].map((feature, i) => (
            <Link
              key={i}
              href={feature.comingSoon ? "#" : feature.href}
              className={`relative p-6 bg-card rounded-lg border border-border transition-colors group ${feature.comingSoon
                ? "opacity-75 cursor-not-allowed"
                : "hover:border-primary cursor-pointer"
                }`}
              onClick={feature.comingSoon ? (e) => e.preventDefault() : undefined}
            >
              {feature.comingSoon && (
                <span className="absolute top-3 right-3 px-2 py-1 text-xs font-semibold bg-primary/20 text-primary rounded-full">
                  Coming Soon
                </span>
              )}
              <feature.icon className={`w-12 h-12 text-primary mb-4 ${feature.comingSoon ? "" : "group-hover:scale-110"} transition-transform`} />
              <h3 className="font-bold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-12 text-center border border-primary/20">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Explore?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of explorers discovering Kolkata's rich cultural heritage and making unforgettable memories.
          </p>
          <Link href="/explore">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Begin Your Journey
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-foreground mb-4">Kolkata Explorer</h4>
              <p className="text-sm text-muted-foreground">Discover heritage, culture, and community</p>
            </div>
            {[
              { title: "Explore", links: ["Heritage Sites", "Restaurants"] },
              { title: "Community", links: ["Travel Matches", "Reviews"] },
              { title: "Learn", links: ["About Kolkata", "Guides"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Kolkata Explorer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
