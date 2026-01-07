import { apiClient } from "@/lib/api"

export interface UploadProgress {
  progress: number
  fileName: string
}

export interface UploadResponse {
  url: string
  type: string
  name: string
  size: number
  bucket?: string
  path?: string
}

const BUCKET = "chat-attachments"
const CHAT_FOLDER = "all-users"

const uploadService = {
  async uploadChatAttachment(
    file: File,
    onProgress?: (progress: number) => void,
    token?: string
  ): Promise<UploadResponse> {
    const fileExt = file.name.split(".").pop()
    const filePath = `${CHAT_FOLDER}/chat/${crypto.randomUUID()}.${fileExt}`

    const formData = new FormData()
    formData.append('file', file)
    formData.append('bucket', BUCKET)
    formData.append('pathPrefix', `${CHAT_FOLDER}/chat`)

    if (onProgress) {
      let fakeProgress = 0
      const interval = setInterval(() => {
        fakeProgress = Math.min(fakeProgress + 10, 90)
        onProgress(fakeProgress)
      }, 500)

      try {
        const result = await apiClient.postFormData<UploadResponse>('/upload', formData, token)
        clearInterval(interval)
        onProgress(100)

        return {
          url: result.publicUrl || (result as any).url,
          type: file.type,
          name: file.name,
          size: file.size,
          bucket: result.bucket,
          path: result.path,
        }
      } catch (err) {
        clearInterval(interval)
        throw err
      }
    }

    const result = await apiClient.postFormData<UploadResponse>('/upload', formData, token)

    return {
      url: result.publicUrl || (result as any).url,
      type: file.type,
      name: file.name,
      size: file.size,
      bucket: result.bucket,
      path: result.path,
    }
  },

  async deleteAttachment(url: string, token?: string): Promise<void> {
    const pathname = new URL(url).pathname
    const filePath = pathname.split(`/${BUCKET}/`)[1]

    if (!filePath) {
      throw new Error("Invalid attachment URL")
    }

    await apiClient.request('/upload', {
      method: 'DELETE',
      body: JSON.stringify({ bucket: BUCKET, path: filePath }),
      token,
    })
  },
}

export default uploadService