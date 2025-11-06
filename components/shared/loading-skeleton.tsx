"use client"

export function MentorCardSkeleton() {
  return <div className="skeleton h-64 rounded-lg" />
}

export function ResourceCardSkeleton() {
  return <div className="skeleton h-56 rounded-lg" />
}

export function LinesSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
    </div>
  )
}
