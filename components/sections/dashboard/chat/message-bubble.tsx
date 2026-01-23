"use client"

import { useEffect, useState } from "react"
import { Bot, User, Check, CheckCheck, Clock, ExternalLink, Play } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { MessageAttachment } from "./message-attachment"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import robot from "../../../../public/gifs/robot.gif";
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "@/lib/toast"

interface Source {
  type: 'website' | 'youtube';
  title: string;
  url: string;
  description: string;
  videoTitle?: string;
  channelName?: string;
  thumbnailUrl?: string;
}

// Validation functions for references
function validateYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check for valid YouTube domains
    if (!['www.youtube.com', 'youtube.com', 'youtu.be'].includes(urlObj.hostname)) {
      return false;
    }
    
    // For youtube.com/watch?v= format
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (!videoId || videoId.length !== 11) {
        return false;
      }
      // Ensure video ID contains only valid characters
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
    }
    
    // For youtu.be format
    if (urlObj.hostname === 'youtu.be') {
      const path = urlObj.pathname.slice(1); // Remove leading slash
      if (!path || path.length !== 11) {
        return false;
      }
      return /^[a-zA-Z0-9_-]{11}$/.test(path);
    }
    
    return false;
  } catch {
    return false;
  }
}

function validateYouTubeThumbnailUrl(url: string, videoUrl: string): boolean {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'img.youtube.com') {
      return false;
    }
    
    // Extract video ID from video URL to validate thumbnail
    let videoId = '';
    const videoUrlObj = new URL(videoUrl);
    
    if (videoUrlObj.hostname.includes('youtube.com')) {
      videoId = videoUrlObj.searchParams.get('v') || '';
    } else if (videoUrlObj.hostname === 'youtu.be') {
      videoId = videoUrlObj.pathname.slice(1);
    }
    
    if (!videoId) return false;
    
    // Check if thumbnail URL contains the correct video ID
    return urlObj.pathname.includes(`/vi/${videoId}/`);
  } catch {
    return false;
  }
}

function validateWebsiteUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Must be absolute URL
    if (!urlObj.protocol.startsWith('http')) {
      return false;
    }
    
    // Must have a valid hostname
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return false;
    }
    
    // Avoid localhost/private IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = urlObj.hostname.toLowerCase();
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.') || hostname.startsWith('172.')) {
        return false;
      }
    }
    
    return true;
  } catch {
    return false;
  }
}

function validateSource(source: Source): boolean {
  // Basic required fields
  if (!source.type || !source.title || !source.url || !source.description) {
    return false;
  }
  
  // Type-specific validation
  if (source.type === 'youtube') {
    if (!validateYouTubeUrl(source.url)) {
      return false;
    }
    // For YouTube, ensure required metadata is present and thumbnail URL is valid
    if (!source.videoTitle || !source.channelName || !source.thumbnailUrl) {
      return false;
    }
    if (!validateYouTubeThumbnailUrl(source.thumbnailUrl, source.url)) {
      return false;
    }
  } else if (source.type === 'website') {
    if (!validateWebsiteUrl(source.url)) {
      return false;
    }
  } else {
    return false; // Unknown type
  }
  
  return true;
}

interface ReferencesProps {
  sources: Source[];
}

function References({ sources }: ReferencesProps) {
  return (
    <div className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold text-foreground">References</h4>
      <div className="space-y-2">
        {sources.map((source, index) => (
          <div key={index} className="border border-foreground/10 rounded-lg p-3 bg-background/10">
            {source.type === 'youtube' ? (
              <div className="flex gap-3">
                {source.thumbnailUrl && (
                  <div className="relative shrink-0">
                    <Image
                      src={source.thumbnailUrl}
                      alt={source.videoTitle || source.title}
                      width={120}
                      height={68}
                      className="rounded object-cover"
                      onError={(e) => {
                        // Hide the image if it fails to load
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-6 w-6 text-white drop-shadow-lg" />
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{source.videoTitle || source.title}</h5>
                  <p className="text-xs text-muted-foreground">{source.channelName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  >
                    Watch on YouTube <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <h5 className="font-medium text-sm">{source.title}</h5>
                <p className="text-xs text-muted-foreground mt-1">{source.description}</p>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                >
                  Visit website <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  role: "user" | "assistant"
  content: string
  createdAt: string
  avatarUrl?: string
  status?: "sending" | "sent" | "delivered" | "seen" | "failed"
  isLoading?: boolean
  isNew?: boolean
  senderId?: string
  currentUserId?: string
  attachments?: Array<{ url: string; type: string; name?: string }>
}

export function MessageBubble({
  role,
  content,
  createdAt,
  avatarUrl,
  status,
  isLoading,
  isNew,
  senderId,
  currentUserId,
  attachments,
}: MessageBubbleProps) {
  const [fullContent, setFullContent] = useState("")
  const [animatedContent, setAnimatedContent] = useState("")
  const [references, setReferences] = useState<Source[] | null>(null)

  const hasVideoAttachment = attachments?.some((a) => a.type === 'video')

  const isAiMessage = role === "assistant" || !!hasVideoAttachment

  const isUserMessage = role === "user" && !hasVideoAttachment

  const isCurrentUserMessage = senderId === currentUserId

  // Parse content for references
  useEffect(() => {
    if (content) {
      const researchBlockRegex = /```research\s*\n([\s\S]*?)\n```/
      const match = content.match(researchBlockRegex)
      if (match) {
        try {
          const parsedSources = JSON.parse(match[1]) as Source[]
          // Validate and filter sources
          const validSources = parsedSources.filter(validateSource)
          setReferences(validSources.length > 0 ? validSources : null)
          // Remove the research block from content
          const cleanContent = content.replace(researchBlockRegex, '').trim()
          setFullContent(cleanContent)
        } catch (error) {
          console.error('Failed to parse research references:', error)
          setReferences(null)
          setFullContent(content)
        }
      } else {
        setReferences(null)
        setFullContent(content)
      }
    }
  }, [content])

  useEffect(() => {
    if (isAiMessage && fullContent && isNew && !isLoading) {
      let index = 0
      const interval = setInterval(() => {
        if (index <= fullContent.length) {
          setAnimatedContent(fullContent.substring(0, index))
          index++
        } else {
          clearInterval(interval)
        }
      }, 15)

      return () => clearInterval(interval)
    } else {
      setAnimatedContent(fullContent)
    }
  }, [fullContent, isAiMessage, isNew, isLoading])

  const renderStatusIcon = () => {
    if (!isUserMessage || !status) return null

    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "seen":
        return <CheckCheck className="h-3 w-3 text-primary" />
      case "failed":
        return <span className="text-destructive text-xs">Failed</span>
      default:
        return null
    }
  }

  // Detect structured data (flashcards or quiz)
  const detectStructuredData = (content: string) => {
    const flashcardMatch = content.match(/```flashcards\n([\s\S]*?)\n```/)
    if (flashcardMatch) {
      try {
        const data = JSON.parse(flashcardMatch[1])
        return { type: 'flashcards', data }
      } catch {
        return null
      }
    }

    const quizMatch = content.match(/```quiz\n([\s\S]*?)\n```/)
    if (quizMatch) {
      try {
        const data = JSON.parse(quizMatch[1])
        return { type: 'quiz', data }
      } catch {
        return null
      }
    }

    return null
  }

  const structuredData = detectStructuredData(fullContent)
  const router = useRouter()
  const { token } = useAuth()

  const saveFlashcards = async () => {
    if (!structuredData || structuredData.type !== 'flashcards') return

    try {
      await apiClient.post('/tools/flash-cards/generate', {
        title: structuredData.data.title,
        cards: structuredData.data.cards
      }, token)

      toast.success('Flashcards saved successfully!')
      router.push('/dashboard/tools/flash-cards')
    } catch (error) {
      console.error('Failed to save flashcards:', error)
      toast.error('Failed to save flashcards')
    }
  }

  const saveQuiz = async () => {
    if (!structuredData || structuredData.type !== 'quiz') return

    try {
      await apiClient.post('/tools/quizzes/generate', {
        title: structuredData.data.title,
        questions: structuredData.data.questions
      }, token)

      toast.success('Quiz saved successfully!')
      router.push('/dashboard/tools/quizzes')
    } catch (error) {
      console.error('Failed to save quiz:', error)
      toast.error('Failed to save quiz')
    }
  }

  const messageOpacity = isUserMessage && status === "sending" ? "opacity-50" : "opacity-100"

  return (
    <div className={`flex gap-3 ${isUserMessage && isCurrentUserMessage ? "justify-end" : "justify-start"}`}>
      {!isUserMessage || !isCurrentUserMessage ? (
        <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          {isAiMessage ? (
            <Image src={robot} alt={"robot"} width={100} height={100} />
          ) : avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Avatar"
              className="h-6 w-6 rounded-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <User className="h-4 w-4 text-primary" />
          )}
        </div>
      ) : null}

      <div className="max-w-xs lg:max-w-md xl:max-w-lg flex flex-col gap-1">
        {attachments && attachments.length > 0 && (
          <div className="space-y-2 mb-2">
            {attachments
              .filter((a) => a.type !== 'generation_job')
              .map((attachment, index) => (
                <MessageAttachment
                  key={index}
                  url={attachment.url}
                  type={attachment.type}
                  name={attachment.name}
                />
              ))}
          </div>
        )}

        {/* Message Bubble */}
        {content && (
          <div
            className={`px-4 py-2 rounded-lg transition-opacity ${messageOpacity} ${isUserMessage && isCurrentUserMessage
              ? "bg-primary text-primary-foreground rounded-br-none"
              : "bg-muted text-foreground rounded-bl-none"
              }`}
          >
            <div className="text-sm whitespace-pre-wrap prose prose-sm max-w-none">
              {structuredData ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    {structuredData.type === 'flashcards' ? (
                      <p>I've generated {structuredData.data.cards?.length || 0} flashcards for you!</p>
                    ) : (
                      <p>I've generated a quiz with {structuredData.data.questions?.length || 0} questions!</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {structuredData.type === 'flashcards' ? (
                      <Button size="sm" onClick={saveFlashcards} className="gap-2">
                        💳 Save as Flashcards
                      </Button>
                    ) : (
                      <Button size="sm" onClick={saveQuiz} className="gap-2">
                        📝 Create Quiz
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {animatedContent}
                </ReactMarkdown>
              )}
            </div>

            {isAiMessage && isLoading && <span className="inline-block animate-pulse">▌</span>}
          </div>
        )}

        {/* References */}
        {references && (
          <References sources={references} />
        )}

        {/* Meta */}
        <div className="flex items-center gap-1 px-2">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          {renderStatusIcon()}
        </div>
      </div>
    </div>
  )
}
