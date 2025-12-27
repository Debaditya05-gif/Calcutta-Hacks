"use client"

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background">
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-border" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Discovering Kolkata...</h3>
          <p className="text-sm text-muted-foreground">Loading heritage experiences</p>
        </div>
      </div>
    </div>
  )
}
