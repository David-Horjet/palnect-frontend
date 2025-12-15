export interface UploadProgress {
  progress: number
  fileName: string
}

export interface UploadResponse {
  url: string
  type: string
  name: string
  size: number
}

const uploadService = {
  async uploadChatAttachment(
    file: File,
    token: string,
    onProgress?: (progress: number) => void,
  ): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", "chat-attachment")

    const xhr = new XMLHttpRequest()

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded * 100) / e.total)
          onProgress(progress)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response.data)
          } catch (error) {
            reject(new Error("Failed to parse upload response"))
          }
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`))
        }
      })

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"))
      })

      xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/upload/chat-attachment`)
      xhr.setRequestHeader("Authorization", `Bearer ${token}`)
      xhr.send(formData)
    })
  },

  async deleteAttachment(url: string, token: string): Promise<void> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/chat-attachment`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      throw new Error("Failed to delete attachment")
    }
  },
}

export default uploadService
