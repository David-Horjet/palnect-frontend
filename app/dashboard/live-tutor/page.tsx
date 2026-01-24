"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
  generateEphemeralToken,
  startLiveSession,
  endLiveSession,
  setConnectionStatus,
  setMuted,
  addCaption,
  clearCaptions,
  setCurrentSession,
  clearCurrentSession,
} from "@/store/slices/liveTutorSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, Video, VideoOff, Loader2 } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { useMediaQuery } from "@/hooks/use-mobile"
import { toast } from "@/lib/toast"
import { GoogleGenAI, Modality } from '@google/genai'

export default function LiveTutorPage() {
  const dispatch = useDispatch<AppDispatch>()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const {
    ephemeralToken,
    currentSession,
    loading,
    error,
    isConnected,
    isMuted,
    connectionStatus,
    captions,
    lastCaption,
  } = useSelector((state: RootState) => state.liveTutor)

  const user = useSelector((state: RootState) => state.auth.user)
  const token = useSelector((state: RootState) => state.auth.token)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)

  const [session, setSession] = useState<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Request microphone permission on mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false, // Start with audio only
        })
        streamRef.current = stream
        setHasPermission(true)
      } catch (error) {
        console.error('Permission denied:', error)
        setHasPermission(false)
        toast.error('Microphone permission required for live tutoring')
      }
    }

    requestPermissions()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (session) {
        session.close()
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Generate token and start session when component mounts
  useEffect(() => {
    if (user && token && hasPermission === true && !ephemeralToken) {
      dispatch(generateEphemeralToken(token))
    }
  }, [user, token, hasPermission, ephemeralToken, dispatch])

  // Start session when token is available
  useEffect(() => {
    if (ephemeralToken && user && token && !currentSession) {
      dispatch(startLiveSession(token))
    }
  }, [ephemeralToken, user, token, currentSession, dispatch])

  // Connect to Gemini Live when session starts
  useEffect(() => {
    if (ephemeralToken && currentSession && hasPermission && !isConnected) {
      connectToGeminiLive()
    }
  }, [ephemeralToken, currentSession, hasPermission, isConnected])

  const connectToGeminiLive = async () => {
    if (!ephemeralToken) return

    dispatch(setConnectionStatus('connecting'))

    try {
      // Initialize Google GenAI client with ephemeral token
      const ai = new GoogleGenAI({
        apiKey: ephemeralToken.token, // Use ephemeral token as API key
      })

      const config = {
        responseModalities: [Modality.AUDIO],
        systemInstruction: "You are Lexi, an AI tutor for students. Provide real-time, adaptive explanations with pacing appropriate for the student's responses. Be encouraging and patient. Focus on voice-first interaction. Keep responses concise but informative.",
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Puck'
            }
          }
        }
      }

      // Connect to Live API
      const liveSession = await ai.live.connect({
        model: ephemeralToken.model,
        config: config,
        callbacks: {
          onopen: () => {
            dispatch(setConnectionStatus('connected'))
            console.log('Connected to Gemini Live')
          },
          onmessage: (message: any) => {
            // Handle incoming messages
            if (message.serverContent && message.serverContent.modelTurn && message.serverContent.modelTurn.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                if (part.text) {
                  dispatch(addCaption(part.text))
                }
                if (part.inlineData && part.inlineData.data) {
                  // Play audio data
                  playAudio(part.inlineData.data)
                }
              }
            }

            if (message.serverContent && message.serverContent.turnComplete) {
              console.log('Turn complete')
            }
          },
          onerror: (error: any) => {
            console.error('Live API error:', error)
            dispatch(setConnectionStatus('error'))
            toast.error('Connection failed. Please try again.')
          },
          onclose: () => {
            dispatch(setConnectionStatus('disconnected'))
            console.log('Disconnected from Gemini Live')
          },
        },
      })

      setSession(liveSession)

    } catch (error) {
      console.error('Failed to connect:', error)
      dispatch(setConnectionStatus('error'))
      toast.error('Failed to establish connection')
    }
  }

  // Set up audio streaming when session is connected
  useEffect(() => {
    if (session && streamRef.current && isConnected) {
      startAudioStreaming()
    }
  }, [session, isConnected])

  const startAudioStreaming = () => {
    if (!streamRef.current) return

    const audioContext = new AudioContext({ sampleRate: 16000 })
    audioContextRef.current = audioContext

    const source = audioContext.createMediaStreamSource(streamRef.current)
    const processor = audioContext.createScriptProcessor(4096, 1, 1)

    processor.onaudioprocess = (event) => {
      if (!isMuted) {
        const inputBuffer = event.inputBuffer
        const inputData = inputBuffer.getChannelData(0)

        // Convert to 16-bit PCM
        const pcmData = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768))
        }

        // Send audio chunk
        sendAudioChunk(pcmData.buffer)
      }
    }

    source.connect(processor)
    processor.connect(audioContext.destination)
  }

  const playAudio = (audioData: string) => {
    // Simplified audio playback - in production, decode PCM data properly
    if (audioContextRef.current) {
      const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length / 2, 24000)
      const channelData = audioBuffer.getChannelData(0)
      // Convert base64 to float32 array (simplified)
      // This would need proper PCM decoding
      console.log('Audio data received:', audioData.length, 'bytes')
    }
  }

  const sendAudioChunk = (audioData: ArrayBuffer) => {
    if (session) {
      session.sendRealtimeInput({
        audio: {
          data: btoa(String.fromCharCode(...new Uint8Array(audioData))),
          mimeType: "audio/pcm;rate=16000"
        }
      })
    }
  }

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        dispatch(setMuted(!isMuted))
      }
    }
  }

  const toggleVideo = async () => {
    if (!isVideoEnabled) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream
        }
        setIsVideoEnabled(true)
      } catch (error) {
        toast.error('Video permission denied')
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
        videoRef.current.srcObject = null
      }
      setIsVideoEnabled(false)
    }
  }

  const endCall = () => {
    // Generate session summary from captions
    const sessionTranscript = captions.join(' ')
    const keyConcepts = extractKeyConcepts(sessionTranscript)
    const summary = generateSessionSummary(sessionTranscript)

    const sessionData = {
      summary,
      keyConcepts,
      flashcardsGenerated: true,
      quizzesGenerated: true,
      references: []
    }

    if (currentSession && token) {
      dispatch(endLiveSession({
        sessionId: currentSession.id,
        data: sessionData,
        token
      }))
    }

    // Close connections
    if (session) {
      session.close()
      setSession(null)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }

    dispatch(clearCurrentSession())
    setShowEndDialog(false)
  }

  const extractKeyConcepts = (transcript: string): string[] => {
    // Simple keyword extraction - in production, use NLP or AI
    const keywords = ['algorithm', 'function', 'variable', 'class', 'method', 'data', 'structure', 'loop', 'condition', 'array', 'object']
    return keywords.filter(keyword => transcript.toLowerCase().includes(keyword.toLowerCase())).slice(0, 5)
  }

  const generateSessionSummary = (transcript: string): string => {
    // Simple summary generation - in production, use AI summarization
    const words = transcript.split(' ')
    if (words.length > 50) {
      return words.slice(0, 50).join(' ') + '...'
    }
    return transcript || 'Live tutoring session completed'
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          <DashboardSidebar activeTab="live-tutor" />
          <main className="flex-1 p-6">
            <Card className="max-w-md mx-auto p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Microphone Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Live tutoring requires microphone access to communicate with your AI tutor.
              </p>
              <Button onClick={() => window.location.reload()}>
                Grant Permission
              </Button>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <DashboardSidebar activeTab="live-tutor" />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Live Tutor</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time AI tutoring with voice interaction</p>
            </div>

            {/* Video/Audio Interface */}
            <Card className="aspect-video bg-black rounded-lg overflow-hidden mb-4 relative">
              {isVideoEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-400">Video off</p>
                  </div>
                </div>
              )}

              {/* Connection Status */}
              <div className="absolute top-4 left-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  connectionStatus === 'connected' ? 'bg-green-500 text-white' :
                  connectionStatus === 'connecting' ? 'bg-yellow-500 text-black' :
                  connectionStatus === 'error' ? 'bg-red-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {connectionStatus === 'connected' ? 'Connected' :
                   connectionStatus === 'connecting' ? 'Connecting...' :
                   connectionStatus === 'error' ? 'Connection Error' :
                   'Disconnected'}
                </div>
              </div>

              {/* Captions */}
              {lastCaption && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 text-white p-3 rounded-lg">
                    <p className="text-sm">{lastCaption}</p>
                  </div>
                </div>
              )}
            </Card>

            {/* Controls */}
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="lg"
                onClick={toggleMute}
                disabled={!isConnected}
                className="rounded-full w-14 h-14 p-0"
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={toggleVideo}
                className="rounded-full w-14 h-14 p-0"
              >
                {isVideoEnabled ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </Button>

              <Button
                variant="destructive"
                size="lg"
                onClick={() => setShowEndDialog(true)}
                className="rounded-full w-14 h-14 p-0"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </div>

            {/* Status */}
            <div className="text-center">
              {loading && (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Setting up your session...</span>
                </div>
              )}
              {error && (
                <p className="text-red-500">{error}</p>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* End Call Dialog */}
      {showEndDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">End Live Session?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This will generate flashcards and quizzes from your session.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowEndDialog(false)}>
                Cancel
              </Button>
              <Button onClick={endCall}>
                End Session
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}