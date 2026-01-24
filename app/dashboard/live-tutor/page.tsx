"use client"

import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
    generateEphemeralToken,
    startLiveSession as startLiveSessionAction,
    endLiveSession as endLiveSessionAction,
    setConnectionStatus,
    setMuted,
    addCaption,
    clearCaptions,
    setCurrentSession,
    clearCurrentSession,
    fetchLiveSessions,
    endLiveSession,
} from "@/store/slices/liveTutorSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DialogProvider,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Mic, MicOff, PhoneOff, Video, VideoOff, Loader2, Play, History, MessageSquare, BookOpen, Brain, User, RefreshCw } from "lucide-react"
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar"
import { useMediaQuery } from "@/hooks/use-mobile"
import { toast } from "@/lib/toast"
import { GoogleGenAI, Modality } from '@google/genai'
import Image from "next/image"

type ViewState = 'lobby' | 'call'

export default function LiveTutorPage() {
    const dispatch = useDispatch<AppDispatch>()
    const isMobile = useMediaQuery("(max-width: 768px)")
    const [viewState, setViewState] = useState<ViewState>('lobby')

    const {
        sessions,
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
    const [isRetrying, setIsRetrying] = useState(false)

    const [session, setSession] = useState<any>(null)
    const audioContextRef = useRef<AudioContext | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [audioQueue, setAudioQueue] = useState<string[]>([])
    const [isPlaying, setIsPlaying] = useState(false)

    // Load session history on mount
    useEffect(() => {
        if (token) {
            dispatch(fetchLiveSessions(token))
        }
    }, [token, dispatch])

    // Request microphone permission only when starting a call
    useEffect(() => {
        if (viewState === 'call' && hasPermission === null) {
            const requestPermissions = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    })
                    streamRef.current = stream
                    setHasPermission(true)
                } catch (error) {
                    console.error('Permission denied:', error)
                    setHasPermission(false)
                    toast.error('Microphone permission required for live tutoring')
                    setViewState('lobby')
                }
            }

            requestPermissions()
        }
    }, [viewState, hasPermission])

    // Generate token and start session only when in call state
    useEffect(() => {
        if (viewState === 'call' && user && token && hasPermission === true && !ephemeralToken) {
            dispatch(generateEphemeralToken(token))
        }
    }, [viewState, user, token, hasPermission, ephemeralToken, dispatch])

    // Start session when token is available
    useEffect(() => {
        if (viewState === 'call' && ephemeralToken && user && token && !currentSession) {
            dispatch(startLiveSessionAction(token))
        }
    }, [viewState, ephemeralToken, user, token, currentSession, dispatch])

    // Connect to Gemini Live when session starts
    useEffect(() => {
        if (viewState === 'call' && ephemeralToken && currentSession && hasPermission && !isConnected) {
            connectToGeminiLive()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewState, ephemeralToken, currentSession, hasPermission, isConnected])

    // Set up audio streaming when session is connected
    useEffect(() => {
        if (viewState === 'call' && session && streamRef.current && isConnected) {
            startAudioStreaming()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [viewState, session, isConnected])

    // Cleanup on unmount
    useEffect(() => {
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
    }, [session])
    
    // Process audio queue
    useEffect(() => {
        if (audioQueue.length > 0 && !isPlaying) {
            const nextAudio = audioQueue[0]
            setIsPlaying(true)
            
            const audioData = atob(nextAudio)
            const pcmData = new Float32Array(audioData.length / 4)
            for (let i = 0; i < pcmData.length; i++) {
                pcmData[i] = (audioData.charCodeAt(i * 4) + (audioData.charCodeAt(i * 4 + 1) << 8) + (audioData.charCodeAt(i * 4 + 2) << 16) + (audioData.charCodeAt(i * 4 + 3) << 24)) / 2147483648
            }
            
            if (audioContextRef.current) {
                const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 24000)
                audioBuffer.copyToChannel(pcmData, 0)
                
                const source = audioContextRef.current.createBufferSource()
                source.buffer = audioBuffer
                source.connect(audioContextRef.current.destination)
                source.onended = () => {
                    setAudioQueue(prev => prev.slice(1))
                    setIsPlaying(false)
                }
                source.start()
            }
        }
    }, [audioQueue, isPlaying])

    const connectToGeminiLive = async () => {
        if (!ephemeralToken) return

        dispatch(setConnectionStatus('connecting'))
        console.log('Connecting to Gemini Live...', ephemeralToken)

        try {
            // Initialize Google GenAI client with ephemeral token
            const ai = new GoogleGenAI({
                apiKey: ephemeralToken.token,
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

            console.log('Gemini Live session started:', liveSession)

            setSession(liveSession)

        } catch (error) {
            console.error('Failed to connect:', error)
            dispatch(setConnectionStatus('error'))
            toast.error('Failed to establish connection')
        }
    }

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
                sendAudioChunk(new Uint8Array(pcmData.buffer))
            }
        }

        source.connect(processor)
        processor.connect(audioContext.destination)
    }

    const playAudio = (audioData: string) => {
        setAudioQueue(prev => [...prev, audioData])
    }

    const sendAudioChunk = (audioData: Uint8Array) => {
        if (session) {
            session.sendRealtimeInput({
                audio: {
                    data: audioData,
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

    const startSession = () => {
        setViewState('call')
        setHasPermission(null)
    }

    const endSession = () => {
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
            dispatch(endLiveSessionAction({
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
            streamRef.current = null
        }
        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }

        // Reset states
        dispatch(clearCurrentSession())
        dispatch(clearCaptions())
        setHasPermission(null)
        setIsVideoEnabled(false)
        setViewState('lobby')
        setShowEndDialog(false)
    }

    const retryConnection = async () => {
        setIsRetrying(true)
        dispatch(setConnectionStatus('connecting'))

        try {
            await connectToGeminiLive()
        } catch (error) {
            console.error('Retry failed:', error)
            dispatch(setConnectionStatus('error'))
            toast.error('Failed to reconnect. Please try again.')
        } finally {
            setIsRetrying(false)
        }
    }

    const extractKeyConcepts = (transcript: string): string[] => {
        const keywords = ['algorithm', 'function', 'variable', 'class', 'method', 'data', 'structure', 'loop', 'condition', 'array', 'object']
        return keywords.filter(keyword => transcript.toLowerCase().includes(keyword.toLowerCase())).slice(0, 5)
    }

    const generateSessionSummary = (transcript: string): string => {
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

    const LobbyView = () => (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            {/* Robot GIF */}
            <div className="relative">
                <Image
                    src="/gifs/robot.gif"
                    alt="AI Tutor Robot"
                    width={100}
                    height={100}
                    unoptimized
                    className="rounded-full border-4 border-primary/20"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
                    <Brain className="w-6 h-6" />
                </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold text-foreground">
                    Welcome to Live Tutor
                </h1>
                <p className="text-xl text-muted-foreground">
                    Get personalized, real-time tutoring from our AI assistant. Discuss concepts,
                    ask questions, and receive instant feedback through voice and video.
                </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-card border rounded-lg p-6 text-center space-y-3">
                    <MessageSquare className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">Voice-First Learning</h3>
                    <p className="text-sm text-muted-foreground">
                        Natural conversation with AI tutor through advanced speech recognition
                    </p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center space-y-3">
                    <BookOpen className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">Instant Study Materials</h3>
                    <p className="text-sm text-muted-foreground">
                        Automatically generate flashcards and quizzes from your session
                    </p>
                </div>
                <div className="bg-card border rounded-lg p-6 text-center space-y-3">
                    <History className="w-8 h-8 mx-auto text-primary" />
                    <h3 className="font-semibold">Session History</h3>
                    <p className="text-sm text-muted-foreground">
                        Review past sessions and continue learning from previous discussions
                    </p>
                </div>
            </div>

            {/* Start Session Button */}
            <Button
                onClick={startSession}
                size="lg"
                className="px-8 py-4 text-lg font-semibold"
            >
                <Play className="w-5 h-5 mr-2" />
                Start Live Session
            </Button>

            {/* Recent Sessions */}
            {sessions?.length > 0 && (
                <div className="w-full max-w-4xl space-y-4">
                    <h2 className="text-2xl font-semibold text-center">Recent Sessions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sessions.slice(0, 4).map((session) => (
                            <div key={session.id} className="bg-card border rounded-lg p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">
                                        {new Date(session.created_at).toLocaleDateString()}
                                    </span>
                                    <Badge variant="secondary">
                                        {session.duration ? `${Math.round(session.duration / 60)} min` : 'Active'}
                                    </Badge>
                                </div>
                                {session.summary && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {session.summary}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )

    const CallView = () => (
        <div className="flex flex-col h-[80vh] bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Live Session Active</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEndDialog(true)}
                    className="text-red-600 hover:text-red-700"
                >
                    End Session
                </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* AI Tutor (Main Focus) */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-md aspect-square">
                        <Image
                            src="/gifs/robot.gif"
                            alt="AI Tutor"
                            fill
                            unoptimized
                            className="rounded-2xl h-48 w-48 object-cover border-4 border-primary/20"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                            AI Tutor
                        </div>
                        {connectionStatus === 'connected' && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                                Connected
                            </div>
                        )}
                    </div>
                </div>

                {/* User Video Tile */}
                <div className="w-80 border-l bg-muted/30 p-4">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                        {isVideoEnabled && videoRef.current ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white">
                                <div className="text-center">
                                    <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Camera off</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <p className="font-medium">You</p>
                        <p className="text-sm text-muted-foreground">Student</p>
                    </div>
                </div>
            </div>

            {/* Control Bar */}
            <div className="border-t p-4">
                <div className="flex items-center justify-center space-x-4">
                    <Button
                        variant={!isMuted ? "primary" : "destructive"}
                        size="lg"
                        onClick={toggleMute}
                        className="rounded-full"
                    >
                        {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        variant={isVideoEnabled ? "primary" : "secondary"}
                        size="lg"
                        onClick={toggleVideo}
                        className="rounded-full"
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>

                    {connectionStatus === 'error' && (
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={retryConnection}
                            disabled={isRetrying}
                            className="rounded-full px-6"
                        >
                            {isRetrying ? (
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            ) : (
                                <RefreshCw className="w-5 h-5 mr-2" />
                            )}
                            Retry
                        </Button>
                    )}
                </div>
            </div>

            {/* Captions */}
            {captions.length > 0 && (
                <div className="border-t p-4 bg-muted/30">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-sm text-center">
                            <span className="font-medium">AI: </span>
                            {captions[captions.length - 1]}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
                <DashboardSidebar activeTab="live-tutor" />
                <main className="flex-1 p-6">
                    {viewState === 'lobby' ? <LobbyView /> : <CallView />}

                    {/* End Session Dialog */}
                    <DialogProvider open={showEndDialog} onOpenChange={setShowEndDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>End Live Session?</DialogTitle>
                                <DialogDescription>
                                    This will generate flashcards and quizzes from your session.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowEndDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={endSession}>
                                    End Session
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </DialogProvider>
                </main>
            </div>
        </div>
    )
}