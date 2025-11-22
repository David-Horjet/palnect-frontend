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
import { SearchableSelect } from "@/components/shared/searchable-select"
import { institutions } from "@/data/institutions"

export default function UploadResourcePage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { loading } = useSelector((state: RootState) => state.resources)

  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isCompressing, setIsCompressing] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Lecture Notes",
    subject: "",
    year: "100",
    school: "",
    department: "",
  })

  const categories = ["Past Questions", "Lecture Notes", "Assignments", "Study Guides"]
  const years = ["100", "200", "300", "400", "500", "600"]

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
        handleFileCompression(droppedFile)
      } else {
        toast.error("Please drop a PDF file")
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileCompression(e.target.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "subject") {
      const upperValue = value.toUpperCase().slice(0, 6)
      setFormData((prev) => ({ ...prev, [name]: upperValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSchoolChange = (value: string) => {
    setFormData((prev) => ({ ...prev, school: value, department: "" }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, department: value }))
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
          department: formData.department,
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
        department: "",
      })

      // Redirect to resources page
      router.push("/dashboard/resources?view=my")
    } catch (error) {
      // Error handled by Redux and toast
      console.error("Upload failed:", error)
    }
  }

  const currentInstitution = institutions.find((inst) => inst.name === formData.school)
  const isFormValid =
    file && formData.title && formData.description && formData.subject && formData.school && formData.department

  const handleFileCompression = async (selectedFile: File) => {
    setIsCompressing(true)
    setUploadProgress(10)
    try {
      const compressed = await compressFile(selectedFile)
      setUploadProgress(100)
      setTimeout(() => {
        setFile(compressed)
        setUploadProgress(0)
        setIsCompressing(false)
      }, 500)
    } catch (error) {
      toast.error("Failed to compress file")
      setIsCompressing(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab="resources" />

      <main className="flex-1 overflow-auto">
        <DashboardHeader title="Upload Resource" subtitle="Share your study materials with the Palnect community" />

        <div className="p-6 space-y-6 max-w-4xl">
          {isCompressing && (
            <Card className="p-6">
              <UploadProgress progress={uploadProgress} fileName={file?.name} />
            </Card>
          )}
          {/* Upload Area */}
          <Card
            className={`border-2 border-dashed p-12 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            onDragEnd={handleDrag}
            onDragStart={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-primary/10 rounded-lg">
                  <Upload className="h-8 w-8 text-primary mx-auto" />
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold text-foreground mb-1">Drop your PDF here</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4">or click to browse</p>
                </div>

                <input type="file" accept=".pdf, .docx" onChange={handleFileSelect} className="hidden" id="fileInput" />

                <Button variant="outline" onClick={() => document.getElementById("fileInput")?.click()}>
                  Browse Files
                </Button>

                <p className="text-xs text-muted-foreground">Maximum file size: 10MB • PDF and DOC only</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="inline-block p-4 bg-primary/10 rounded-lg">
                  <FileText className="h-8 w-8 text-primary mx-auto" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
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
                  // className="w-full"
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

                {/* Year and School */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject Code *</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g., OPT423, SAA442"
                      maxLength={6}
                    />
                  </div>
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
                </div>
                <SearchableSelect
                  label="School/University *"
                  placeholder="Select your institution"
                  value={formData.school}
                  onChange={handleSchoolChange}
                  options={institutions.map((inst) => inst.name)}
                  searchPlaceholder="Search institution..."
                />

                <SearchableSelect
                  label="Department *"
                  placeholder="Select your department"
                  value={formData.department}
                  onChange={handleDepartmentChange}
                  options={currentInstitution?.departments || []}
                  disabled={!formData.school}
                  searchPlaceholder="Search department..."
                />
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
            <h3 className="font-bold text-sm md:text-base mb-3 text-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Upload Tips
            </h3>
            <ul className="text-xs md:text-sm text-muted-foreground space-y-2">
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
