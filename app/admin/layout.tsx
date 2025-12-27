"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Users,
    MapPin,
    Utensils,
    Trophy,
    Scroll,
    Settings,
    LogOut,
    Menu,
    X,
    Camera,
} from "lucide-react"

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Heritage Sites", href: "/admin/sites", icon: MapPin },
    { label: "Restaurants", href: "/admin/restaurants", icon: Utensils },
    { label: "Culture Submissions", href: "/admin/culture", icon: Camera },
    { label: "Badges", href: "/admin/badges", icon: Trophy },
    { label: "Quests", href: "/admin/quests", icon: Scroll },
    { label: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
    const [mounted, setMounted] = useState(false)

    const checkAuth = useCallback(() => {
        const token = localStorage.getItem("adminAuth")

        if (!token) {
            return false
        }

        // Simple token validation (check length)
        return token.length === 64
    }, [])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        // Login page - always allow
        if (pathname === "/admin") {
            setAuthState("authenticated")
            return
        }

        // Check auth for other pages
        if (checkAuth()) {
            setAuthState("authenticated")
        } else {
            setAuthState("unauthenticated")
            router.replace("/admin")
        }
    }, [pathname, router, mounted, checkAuth])

    function handleLogout() {
        localStorage.removeItem("adminAuth")
        setAuthState("unauthenticated")
        router.replace("/admin")
    }

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        )
    }

    // Show login page without sidebar
    if (pathname === "/admin") {
        return <>{children}</>
    }

    // Loading state
    if (authState === "loading") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        )
    }

    // Not authenticated - redirect handled in useEffect
    if (authState === "unauthenticated") {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar - Always visible on desktop */}
            <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-orange-600">Kolkata Explorer</h1>
                    <p className="text-sm text-gray-500">Admin Panel</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? "bg-orange-50 text-orange-600 font-medium"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-2 w-full text-gray-500 hover:text-gray-700 text-sm mt-2"
                    >
                        ← Back to App
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-50">
                <h1 className="text-xl font-bold text-orange-600">Admin Panel</h1>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                    {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                    <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 lg:hidden">
                        <div className="h-full flex flex-col pt-16">
                            {/* Navigation */}
                            <nav className="flex-1 p-4 overflow-y-auto">
                                <ul className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                        ? "bg-orange-50 text-orange-600 font-medium"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <item.icon size={20} />
                                                    {item.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-200">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </aside>
                </>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 lg:p-8 min-h-screen pt-20 lg:pt-8">
                {children}
            </main>
        </div>
    )
}
