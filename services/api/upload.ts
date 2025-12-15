import { getSupabaseAdmin } from "@/lib/supabase"

const supabase = getSupabaseAdmin()

const { data } = await supabase.auth.getSession()
console.log("Supabase session:", data)

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

const BUCKET = "user-uploads"
const CHAT_FOLDER = "chat-attachments"

const uploadService = {
  async uploadChatAttachment(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const fileExt = file.name.split(".").pop()
    const filePath = `${CHAT_FOLDER}/chat/${crypto.randomUUID()}.${fileExt}`

    try {
      // 1️⃣ Create signed URL for PUT (valid 60s)
      const { data: signedData, error: signedError } = await supabase
        .storage
        .from(BUCKET)
        .createSignedUrl(filePath, 60, { transform: {  method: "PUT" } })

      if (signedError || !signedData) throw signedError || new Error("Failed to create signed URL")

      const signedUrl = signedData.signedUrl

      // 2️⃣ Upload using XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest()
      xhr.open("PUT", signedUrl)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          const progress = Math.round((e.loaded * 100) / e.total)
          onProgress(progress)
        }
      }

      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const publicUrlData = supabase.storage.from(BUCKET).getPublicUrl(filePath)
            resolve({
              url: publicUrlData.data.publicUrl,
              type: file.type,
              name: file.name,
              size: file.size,
            })
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }

        xhr.onerror = () => reject(new Error("Upload failed"))

        xhr.send(file)
      })

      return await uploadPromise
    } catch (err) {
      throw err
    }
  },

  async deleteAttachment(url: string): Promise<void> {
    const pathname = new URL(url).pathname
    const filePath = pathname.split(`/${BUCKET}/`)[1]

    if (!filePath) {
      throw new Error("Invalid attachment URL")
    }

    const { error } = await supabase.storage.from(BUCKET).remove([filePath])
    if (error) throw error
  },
}

export default uploadService
