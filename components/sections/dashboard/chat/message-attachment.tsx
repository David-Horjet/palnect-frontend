"use client"

import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MessageAttachmentProps {
  url: string
  type: string
  name?: string
}

export function MessageAttachment({ url, type, name }: MessageAttachmentProps) {
  const fileName = name || url.split("/").pop() || "Document"
  const fileExtension = fileName.split(".").pop()?.toUpperCase() || "FILE"

  const handleDownload = () => {
    window.open(url, "_blank")
  }

  if (type === 'video') {
    return (
      <div className="rounded-lg border border-border bg-background/50 p-3 max-w-2xl">
        <video src={url} controls className="w-full max-h-[360px] rounded-md bg-black" />
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="p-0 hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 max-w-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <FileText className="h-5 w-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground">{fileExtension}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="p-0 hover:bg-primary/10"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  )
}
