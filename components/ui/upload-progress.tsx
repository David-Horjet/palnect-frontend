"use client"

import { useEffect, useState } from "react"

interface UploadProgressProps {
  progress: number
  fileName?: string
}

export function UploadProgress({ progress, fileName }: UploadProgressProps) {
  const [displayProgress, setDisplayProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress((prev) => Math.min(prev + 5, progress))
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [displayProgress, progress])

  return (
    <div className="w-full space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-foreground font-medium">Uploading & Compressing...</span>
        <span className="text-primary font-semibold">{Math.round(displayProgress)}%</span>
      </div>

      {fileName && <p className="text-xs text-muted-foreground truncate">{fileName}</p>}

      <div className="relative h-12 bg-linear-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20 overflow-hidden">
        {/* Water jar fill animation */}
        <div
          className="absolute inset-0 bg-linear-to-r from-primary to-accent transition-all duration-300 ease-out flex items-center justify-center"
          style={{ width: `${displayProgress}%` }}
        >
          {/* Wave effect */}
          <div className="absolute inset-0 opacity-30">
            <svg
              className="absolute w-full h-full"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              style={{
                animation: `wave 3s linear infinite`,
              }}
            >
              <defs>
                <style>{`
                  @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(1200px); }
                  }
                `}</style>
              </defs>
              <path d="M0,40 Q300,20 600,40 T1200,40 L1200,120 L0,120 Z" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>
        </div>

        {/* Progress text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground drop-shadow-md">{Math.round(displayProgress)}%</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">Please wait, this may take a moment...</p>
    </div>
  )
}
