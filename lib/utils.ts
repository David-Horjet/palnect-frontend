export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}