"use client"

import { X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AttachmentPreviewProps {
  file: File
  uploadProgress: number
  onRemove: () => void
}

export function AttachmentPreview({ file, uploadProgress, onRemove }: AttachmentPreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-border bg-background p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          {uploadProgress < 100 && <span className="text-xs text-primary font-medium">{uploadProgress}%</span>}
        </div>

        {/* Progress bar */}
        {uploadProgress < 100 && (
          <div className="mt-2 h-1 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="p-0 hover:bg-destructive/10 hover:text-destructive"
        disabled={uploadProgress > 0 && uploadProgress < 100}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
