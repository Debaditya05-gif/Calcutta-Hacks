"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Map, Users, Utensils, Trophy, CalendarDays } from "lucide-react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: "Explore", href: "/explore", icon: Map },
    { label: "Restaurants", href: "/restaurants", icon: Utensils },
    { label: "Matches", href: "/matches", icon: Users },
    { label: "Trip Planner", href: "/planner", icon: CalendarDays },
    { label: "Achievements", href: "/achievements", icon: Trophy },
  ]

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Map size={24} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:inline">Kolkata Explorer</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-1">
          {menuItems.map(({ label, href }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition">
                {label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-muted rounded-lg transition">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex gap-3">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <div className="px-4 py-3 space-y-2">
            {menuItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-primary/10 rounded-lg transition"
              >
                <Icon size={20} />
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                <Button variant="ghost" className="w-full">Sign In</Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)} className="block">
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

