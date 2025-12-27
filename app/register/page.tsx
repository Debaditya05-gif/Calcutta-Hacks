"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Map, Eye, EyeOff, Loader2 } from "lucide-react"

const interestOptions = [
    "Heritage", "Photography", "Food", "Adventure", "Culture",
    "Museums", "Art", "History", "Travel", "Spirituality"
]

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        travelStyle: "",
    })
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((i) => i !== interest)
                : [...prev, interest]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    age: formData.age ? parseInt(formData.age) : null,
                    gender: formData.gender || null,
                    travelStyle: formData.travelStyle || null,
                    interests: selectedInterests,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setError(data.error || "Registration failed")
                return
            }

            // Redirect to login page on success
            router.push("/login?registered=true")
        } catch {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-amber-50/20 to-orange-50/20 flex flex-col">
            {/* Header */}
            <nav className="border-b border-border bg-card/80 backdrop-blur">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <Map size={24} className="text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl text-foreground">Kolkata Explorer</span>
                    </Link>
                </div>
            </nav>

            {/* Register Form */}
            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-lg">
                    <div className="bg-card border border-border rounded-xl shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
                            <p className="text-muted-foreground">Join the Kolkata Explorer community</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Basic Info */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Your full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Min 6 characters"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            required
                                            className="h-12 pr-12"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        required
                                        className="h-12"
                                    />
                                </div>
                            </div>

                            {/* Optional Profile Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Your age"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="h-12"
                                        min={18}
                                        max={100}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                    >
                                        <SelectTrigger className="h-12">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Travel Style</Label>
                                <Select
                                    value={formData.travelStyle}
                                    onValueChange={(value) => setFormData({ ...formData, travelStyle: value })}
                                >
                                    <SelectTrigger className="h-12">
                                        <SelectValue placeholder="Select your travel style" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cultural">Cultural Explorer</SelectItem>
                                        <SelectItem value="adventurous">Adventure Seeker</SelectItem>
                                        <SelectItem value="luxury">Luxury Traveler</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Interests */}
                            <div className="space-y-3">
                                <Label>Interests (select multiple)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    {interestOptions.map((interest) => (
                                        <div key={interest} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={interest}
                                                checked={selectedInterests.includes(interest)}
                                                onCheckedChange={() => toggleInterest(interest)}
                                            />
                                            <label
                                                htmlFor={interest}
                                                className="text-sm cursor-pointer text-foreground"
                                            >
                                                {interest}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-lg mt-6"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-muted-foreground">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
