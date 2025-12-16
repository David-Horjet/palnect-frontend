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

const BUCKET = "chat-attachments"
const CHAT_FOLDER = "all-users"

const uploadService = {
  async uploadChatAttachment(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadResponse> {
    const fileExt = file.name.split(".").pop()
    const filePath = `${CHAT_FOLDER}/chat/${crypto.randomUUID()}.${fileExt}`

    if (onProgress) {
      let fakeProgress = 0
      const interval = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 10, 90)
        onProgress(fakeProgress)
      }, 500)

      try {
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          })

        clearInterval(interval)
        if (error) throw error

        onProgress(100)

        const { data } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(filePath)

        return {
          url: data.publicUrl,
          type: file.type,
          name: file.name,
          size: file.size,
        }
      } catch (err) {
        clearInterval(interval)
        throw err
      }
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file)

    if (error) throw error

    const { data } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    return {
      url: data.publicUrl,
      type: file.type,
      name: file.name,
      size: file.size,
    }
  },

  async deleteAttachment(url: string): Promise<void> {
    const pathname = new URL(url).pathname
    const filePath = pathname.split(`/${BUCKET}/`)[1]

    if (!filePath) {
      throw new Error("Invalid attachment URL")
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([filePath])

    if (error) throw error
  },
}

export default uploadService