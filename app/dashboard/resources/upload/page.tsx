"use client"

import type React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { uploadResource } from "@/store/slices/resourcesSlice"
import type { AppDispatch, RootState } from "@/store/store"
import { toast } from "@/lib/toast"
import { DashboardHeader } from "@/components/layout/dashboard/header"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"

export default function UploadResourcePage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading } = useSelector((state: RootState) => state.resources)

  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Lecture Notes",
    subject: "",
    year: "100",
    school: "",
  })

  const categories = ["Past Questions", "Lecture Notes", "Assignments", "Study Guides"]
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"]
  const schools = ["University of Lagos", "University of Ibadan", "OAU"]
  const years = ["100", "200", "300", "400"]

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile)
      } else {
        toast.error("Please drop a PDF file")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = async () => {
    if (!file || !isFormValid) {
      toast.error("Please fill all required fields and select a file")
      return
    }

    try {
      await dispatch(
        uploadResource({
          file,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          subject: formData.subject,
          year: formData.year,
          school: formData.school,
        }),
      ).unwrap()

      // Reset form
      setFile(null)
      setFormData({
        title: "",
        description: "",
        category: "Lecture Notes",
        subject: "",
        year: "100",
        school: "",
      })

      // Redirect to resources page
      router.push("/dashboard/resources?view=my")
    } catch (error) {
      // Error handled by Redux and toast
      console.error("Upload failed:", error)
    }
  }

  const isFormValid = file && formData.title && formData.description && formData.subject && formData.school

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Upload Resource" subtitle="Share your study materials with the Palnect community" />

        <div className="p-6 space-y-6 max-w-4xl">
          {/* Upload Area */}
          <Card
            className={`border-2 border-dashed p-12 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            // onDragEnter={handleDrag}
            // onDragLeave={handleDrag}
            // onDragOver={handleDrag}
            // onDrop={handleDrop}
          >
            {!file ? (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-primary/10 rounded-lg">
                  <Upload className="h-8 w-8 text-primary mx-auto" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Drop your PDF here</h3>
                  <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                </div>

                <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="fileInput" />

                <Button variant="outline" onClick={() => document.getElementById("fileInput")?.click()}>
                  Browse Files
                </Button>

                <p className="text-xs text-muted-foreground">Maximum file size: 10MB • PDF only</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary mx-auto" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => setFile(null)}>
                  Change File
                </Button>
              </div>
            )}
          </Card>

          {file && (
            <>
              {/* Form Fields */}
              <Card className="p-6 space-y-6">
                <h2 className="text-lg font-bold text-foreground">Resource Details</h2>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Physics Lecture Notes - Chapter 5"
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Be descriptive and specific</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description *</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What's in this resource? What topics does it cover?"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Help others understand your resource</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Subject *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year and School */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Year of Study</label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          Year {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">School/University *</label>
                    <select
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background"
                    >
                      <option value="">Select a school</option>
                      {schools.map((school) => (
                        <option key={school} value={school}>
                          {school}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button onClick={handleUpload} disabled={!isFormValid || loading} size="lg" className="flex-1">
                  {loading ? "Uploading..." : "Upload Resource"}
                </Button>
                <Button variant="secondary" size="lg" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </>
          )}

          {/* Tips */}
          <Card className="p-6 bg-muted/50 border-border/50">
            <h3 className="font-bold mb-3 text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Upload Tips
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Use clear, descriptive titles</li>
              <li>• Check that your PDFs are readable and not corrupted</li>
              <li>• Include relevant subjects and academic levels</li>
              <li>• Resources are automatically scanned by our AI for quality</li>
              <li>• Avoid copyrighted materials - stick to your own notes and materials</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  )
}
