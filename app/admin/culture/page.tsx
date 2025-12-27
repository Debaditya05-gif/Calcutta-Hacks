"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Image, User, Calendar, MessageSquare } from "lucide-react"
import type { CultureSubmission } from "@/lib/types"
import { mockCultureSubmissions } from "@/lib/mock-data"

type FilterStatus = "all" | "pending" | "approved" | "rejected"

export default function AdminCulturePage() {
    const [submissions, setSubmissions] = useState<CultureSubmission[]>([])
    const [filter, setFilter] = useState<FilterStatus>("all")
    const [rejectNote, setRejectNote] = useState<string>("")
    const [rejectingId, setRejectingId] = useState<string | null>(null)

    // Load submissions from localStorage + mock data on mount
    useEffect(() => {
        const stored = localStorage.getItem("cultureSubmissions")
        const storedSubmissions = stored ? JSON.parse(stored) : []
        // Combine with mock data (avoiding duplicates)
        const allSubmissions = [...storedSubmissions, ...mockCultureSubmissions]
        setSubmissions(allSubmissions)
    }, [])

    const handleApprove = (id: string) => {
        const updated = submissions.map((s) =>
            s.id === id
                ? { ...s, status: "approved" as const, reviewedAt: new Date() }
                : s
        )
        setSubmissions(updated)
        // Update localStorage for user submissions
        const userSubmissions = updated.filter((s) => s.id.startsWith("cs_"))
        localStorage.setItem("cultureSubmissions", JSON.stringify(userSubmissions))
    }

    const handleReject = (id: string) => {
        if (!rejectNote.trim()) return
        const updated = submissions.map((s) =>
            s.id === id
                ? {
                    ...s,
                    status: "rejected" as const,
                    reviewedAt: new Date(),
                    adminNote: rejectNote,
                }
                : s
        )
        setSubmissions(updated)
        // Update localStorage for user submissions
        const userSubmissions = updated.filter((s) => s.id.startsWith("cs_"))
        localStorage.setItem("cultureSubmissions", JSON.stringify(userSubmissions))
        setRejectingId(null)
        setRejectNote("")
    }

    const filteredSubmissions =
        filter === "all"
            ? submissions
            : submissions.filter((s) => s.status === filter)

    const counts = {
        all: submissions.length,
        pending: submissions.filter((s) => s.status === "pending").length,
        approved: submissions.filter((s) => s.status === "approved").length,
        rejected: submissions.filter((s) => s.status === "rejected").length,
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
                        Pending
                    </span>
                )
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Culture Submissions</h1>
                <p className="text-muted-foreground">Review and manage user culture submissions</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border pb-4">
                {(["all", "pending", "approved", "rejected"] as FilterStatus[]).map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-background/20 text-xs">
                            {counts[status]}
                        </span>
                    </button>
                ))}
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <Image size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No {filter === "all" ? "" : filter} submissions found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                        <div
                            key={submission.id}
                            className="bg-card rounded-xl border border-border overflow-hidden"
                        >
                            <div className="flex flex-col lg:flex-row">
                                {/* Image */}
                                <div className="lg:w-64 h-48 lg:h-auto flex-shrink-0 bg-muted">
                                    <img
                                        src={submission.imageUrl}
                                        alt={submission.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200?text=No+Image"
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">{submission.title}</h3>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <User size={14} />
                                                    {submission.userName}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {new Date(submission.createdAt).toLocaleDateString("en-IN")}
                                                </span>
                                            </div>
                                        </div>
                                        {getStatusBadge(submission.status)}
                                    </div>

                                    <p className="text-muted-foreground mb-4">{submission.description}</p>

                                    {/* Admin Note for rejected */}
                                    {submission.status === "rejected" && submission.adminNote && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-sm text-red-700 flex items-start gap-2">
                                                <MessageSquare size={14} className="mt-0.5 flex-shrink-0" />
                                                <span><strong>Rejection Note:</strong> {submission.adminNote}</span>
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {submission.status === "pending" && (
                                        <div className="space-y-3">
                                            {rejectingId === submission.id ? (
                                                <div className="space-y-2">
                                                    <textarea
                                                        value={rejectNote}
                                                        onChange={(e) => setRejectNote(e.target.value)}
                                                        placeholder="Enter rejection reason..."
                                                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm resize-none"
                                                        rows={2}
                                                    />
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleReject(submission.id)}
                                                            disabled={!rejectNote.trim()}
                                                        >
                                                            Confirm Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                setRejectingId(null)
                                                                setRejectNote("")
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleApprove(submission.id)}
                                                    >
                                                        <CheckCircle size={14} className="mr-1" />
                                                        Approve (+50 pts)
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => setRejectingId(submission.id)}
                                                    >
                                                        <XCircle size={14} className="mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Points awarded badge */}
                                    {submission.status === "approved" && (
                                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                            +{submission.rewardPoints} points awarded
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
