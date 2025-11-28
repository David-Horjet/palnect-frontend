export async function compressFile(file: File, maxSizeMB = 5): Promise<File> {
  return new Promise((resolve, reject) => {
    // For PDFs, we'll use a lighter compression approach
    if (file.type === "application/pdf") {
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.warn("PDF exceeds max size, but compression limited for PDFs. Using original.")
        resolve(file)
      } else {
        resolve(file)
      }
      return
    }

    // For images, use canvas compression
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          if (!ctx) {
            resolve(file)
            return
          }

          // Calculate new dimensions (max width 1920px)
          let width = img.width
          let height = img.height
          const maxWidth = 1920

          if (width > maxWidth) {
            height = (maxWidth * height) / width
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0, width, height)

          // Compress and convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob && blob.size < maxSizeMB * 1024 * 1024) {
                const compressedFile = new File([blob], file.name, { type: file.type })
                resolve(compressedFile)
              } else {
                resolve(file)
              }
            },
            file.type,
            0.8, // JPEG quality
          )
        }
        img.onerror = () => resolve(file)
      }
      reader.onerror = () => resolve(file)
    } else {
      resolve(file)
    }
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}
