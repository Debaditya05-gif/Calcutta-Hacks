"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Camera, CheckCircle, Clock, XCircle, Sparkles, ArrowLeft } from "lucide-react"
import type { CultureSubmission } from "@/lib/types"

export default function CulturePage() {
    const [submissions, setSubmissions] = useState<CultureSubmission[]>([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Load submissions from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("cultureSubmissions")
        if (stored) {
            setSubmissions(JSON.parse(stored))
        }
    }, [])

    // Compress and resize image to reduce storage size
    const compressImage = (base64: string, maxWidth: number = 400): Promise<string> => {
        return new Promise((resolve) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
                canvas.width = img.width * ratio
                canvas.height = img.height * ratio
                const ctx = canvas.getContext("2d")
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL("image/jpeg", 0.6)) // Compress to JPEG at 60% quality
            }
            img.src = base64
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !description || !imagePreview) return

        setIsSubmitting(true)

        try {
            // Compress image before storing
            const compressedImage = await compressImage(imagePreview)

            // Create new submission with compressed image
            const newSubmission: CultureSubmission = {
                id: `cs_${Date.now()}`,
                userId: "current_user",
                userName: "You",
                title,
                description,
                imageUrl: compressedImage,
                status: "pending",
                rewardPoints: 50,
                createdAt: new Date(),
            }

            // Save to localStorage
            const updatedSubmissions = [newSubmission, ...submissions]

            try {
                localStorage.setItem("cultureSubmissions", JSON.stringify(updatedSubmissions))
                setSubmissions(updatedSubmissions)

                // Reset form
                setTitle("")
                setDescription("")
                setImagePreview(null)
                setShowSuccess(true)
                setTimeout(() => setShowSuccess(false), 3000)
            } catch (storageError) {
                // If still too large, remove old submissions to make room
                if (updatedSubmissions.length > 1) {
                    const trimmedSubmissions = updatedSubmissions.slice(0, 5) // Keep only last 5
                    localStorage.setItem("cultureSubmissions", JSON.stringify(trimmedSubmissions))
                    setSubmissions(trimmedSubmissions)
                    setTitle("")
                    setDescription("")
                    setImagePreview(null)
                    setShowSuccess(true)
                    setTimeout(() => setShowSuccess(false), 3000)
                } else {
                    alert("Image is too large. Please try a smaller image.")
                }
            }
        } catch (error) {
            console.error("Error submitting:", error)
            alert("Failed to submit. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                        <CheckCircle size={12} />
                        Approved
                    </span>
                )
            case "rejected":
                return (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                        <XCircle size={12} />
                        Rejected
                    </span>
                )
            default:
                return (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-700 rounded-full">
                        <Clock size={12} />
                        Pending Review
                    </span>
                )
        }
    }

    const approvedPoints = submissions
        .filter((s) => s.status === "approved")
        .reduce((acc, s) => acc + s.rewardPoints, 0)

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center gap-2 mb-2 w-fit hover:text-primary transition">
                        <ArrowLeft size={16} />
                        <span className="text-sm text-muted-foreground">Back to Home</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">Share Your Culture & Heritage</h1>
                    <p className="text-muted-foreground">Upload photos and stories about Kolkata's rich cultural heritage</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Points Banner */}
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-6 mb-8 border border-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                            <Sparkles className="text-primary" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Earn 50 points for each approved submission!</p>
                            <p className="text-2xl font-bold text-foreground">Your Points Earned: {approvedPoints}</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <p className="text-green-800">Your culture submission has been sent for review!</p>
                    </div>
                )}

                {/* Submission Form */}
                <div className="bg-card rounded-xl border border-border p-6 mb-8">
                    <h2 className="text-xl font-bold text-foreground mb-4">Submit Your Culture</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Upload Photo</label>
                            <div className="relative">
                                {imagePreview ? (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImagePreview(null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Camera className="w-12 h-12 text-muted-foreground mb-3" />
                                            <p className="mb-2 text-sm text-muted-foreground">
                                                <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (max 5MB)</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Durga Puja Celebration"
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Share the story behind this cultural moment..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={!title || !description || !imagePreview || isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90"
                            size="lg"
                        >
                            {isSubmitting ? (
                                "Submitting..."
                            ) : (
                                <>
                                    <Upload size={18} className="mr-2" />
                                    Submit for Review
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Past Submissions */}
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Your Submissions</h2>
                    {submissions.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-8 text-center">
                            <Camera size={48} className="mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">You haven't submitted any culture posts yet.</p>
                            <p className="text-sm text-muted-foreground">Share your first cultural moment above!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {submissions.map((submission) => (
                                <div
                                    key={submission.id}
                                    className="bg-card rounded-xl border border-border overflow-hidden"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                                            <img
                                                src={submission.imageUrl}
                                                alt={submission.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4 flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-bold text-foreground">{submission.title}</h3>
                                                {getStatusBadge(submission.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                {submission.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>
                                                    Submitted on{" "}
                                                    {new Date(submission.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                {submission.status === "approved" && (
                                                    <span className="flex items-center gap-1 text-primary font-semibold">
                                                        <Sparkles size={12} />
                                                        +{submission.rewardPoints} points
                                                    </span>
                                                )}
                                            </div>
                                            {submission.status === "rejected" && submission.adminNote && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-xs text-red-700">
                                                        <strong>Admin Note:</strong> {submission.adminNote}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
