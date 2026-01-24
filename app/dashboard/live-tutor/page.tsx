
"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import {
    generateEphemeralToken,
    startLiveSession as startLiveSessionAction,
    setConnectionStatus,
    setMuted,
    addCaption,
    clearCaptions,
    clearCurrentSession,
    fetchLiveSessions,
    endLiveSession as endLiveSessionAction,
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
import { GoogleGenAI, Modality, Session, LiveServerMessage } from '@google/genai'
import Image from "next/image"

// Helper functions matching index.tsx/utils.ts precisely
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    // Ensure we account for potential byte offset in the underlying buffer
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

type ViewState = 'lobby' | 'call'

export default function FixedLiveTutorPage() {
    const dispatch = useDispatch<AppDispatch>()
    const [viewState, setViewState] = useState<ViewState>('lobby')

    const {
        sessions,
        ephemeralToken,
        currentSession,
        isConnected,
        isMuted,
        connectionStatus,
        captions,
    } = useSelector((state: RootState) => state.liveTutor)

    const user = useSelector((state: RootState) => state.auth.user)
    const token = useSelector((state: RootState) => state.auth.token)

    const [isVideoEnabled, setIsVideoEnabled] = useState(false)
    const [showEndDialog, setShowEndDialog] = useState(false)
    const [userVolume, setUserVolume] = useState(0)

    // Refs for session and audio management
    const sessionRef = useRef<Session | null>(null)
    const connectingRef = useRef(false)
    const inputAudioContextRef = useRef<AudioContext | null>(null)
    const outputAudioContextRef = useRef<AudioContext | null>(null)
    const outputNodeRef = useRef<GainNode | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set())
    const nextStartTimeRef = useRef(0)

    // Cleanup Logic
    const cleanupAudio = useCallback(() => {
        sourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { }
        });
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close().catch(() => { });
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close().catch(() => { });
            outputAudioContextRef.current = null;
        }
    }, []);

    const cleanupAll = useCallback(() => {
        cleanupAudio();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (sessionRef.current) {
            try { sessionRef.current.close(); } catch (e) { }
            sessionRef.current = null;
        }
        connectingRef.current = false;
        setUserVolume(0);
    }, [cleanupAudio]);

    // Core Connection Logic - Standardized to match index.tsx pattern
    const initSession = useCallback(async () => {
        if (!ephemeralToken || connectingRef.current || sessionRef.current) return;

        connectingRef.current = true;
        dispatch(setConnectionStatus('connecting'));

        try {
            const ai = new GoogleGenAI({
                apiKey: ephemeralToken.token,
                httpOptions: { apiVersion: 'v1alpha' },
            });

            // Use the stable model from the successful index.tsx example
            const model = 'gemini-2.5-flash-native-audio-preview-12-2025';

            const session = await ai.live.connect({
                model: model,
                callbacks: {
                    onopen: () => {
                        dispatch(setConnectionStatus('connected'));
                        startRecording();
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        console.log('Received server message:', message);
                        // Handle Transcriptions
                        if (message.serverContent?.outputTranscription) {
                            dispatch(addCaption(message.serverContent.outputTranscription.text));
                        }

                        console.log('Processing media parts...');
                        // Handle Audio Output and Text Parts
                        const modelTurn = message.serverContent?.modelTurn;
                        if (modelTurn && modelTurn.parts) {
                            for (const part of modelTurn.parts) {
                                console.log('Processing part:', part);
                                // Extract Text
                                if (part.text) {
                                    dispatch(addCaption(part.text));
                                }

                                console.log('Checking for audio data in part...');
                                // Extract Audio
                                if (part.inlineData?.data && outputAudioContextRef.current && outputNodeRef.current) {
                                    const audioData = part.inlineData.data;
                                    const ctx = outputAudioContextRef.current;
                                    console.log('Decoding and playing audio data...');

                                    nextStartTimeRef.current = Math.max(
                                        nextStartTimeRef.current,
                                        ctx.currentTime
                                    );

                                    const audioBuffer = await decodeAudioData(
                                        decode(audioData),
                                        ctx,
                                        24000,
                                        1
                                    );

                                    const source = ctx.createBufferSource();
                                    source.buffer = audioBuffer;
                                    source.connect(outputNodeRef.current);
                                    source.addEventListener('ended', () => {
                                        sourcesRef.current.delete(source);
                                    });

                                    source.start(nextStartTimeRef.current);
                                    nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                                    sourcesRef.current.add(source);
                                    console.log('Audio source started.');
                                }
                            }
                        }

                        // Handle Interruption
                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            for (const source of sourcesRef.current.values()) {
                                source.stop();
                                sourcesRef.current.delete(source);
                            }
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        dispatch(setConnectionStatus('error'));
                        toast.error("Tutoring session encountered an error.");
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed:', e.reason);
                        dispatch(setConnectionStatus('disconnected'));
                        cleanupAll();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO, Modality.TEXT],
                    systemInstruction: "You are Lexi, an elite AI tutor. Be patient, encouraging, and highly interactive. When a student speaks, respond naturally and immediately. Help them understand concepts through guiding questions and clear explanations.",
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
                    },
                    outputAudioTranscription: {},
                    inputAudioTranscription: {},
                },
            });

            sessionRef.current = session;

            // Setup Output Audio Context
            const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outGain = outCtx.createGain();
            outGain.connect(outCtx.destination);
            outputAudioContextRef.current = outCtx;
            outputNodeRef.current = outGain;
            nextStartTimeRef.current = outCtx.currentTime;

        } catch (error) {
            console.error('Failed to init session:', error);
            dispatch(setConnectionStatus('error'));
            connectingRef.current = false;
        }
    }, [ephemeralToken, dispatch, cleanupAll]);

    const startRecording = async () => {
        console.log('Starting microphone capture...');
        try {
            if (!streamRef.current) {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            }

            console.log('Microphone access granted.');
            const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inCtx;

            // Load AudioWorklet module
            await inCtx.audioWorklet.addModule('/audio-processor.js');

            console.log('AudioWorklet module loaded.');

            const source = inCtx.createMediaStreamSource(streamRef.current);
            const workletNode = new AudioWorkletNode(inCtx, 'audio-processor');

            console.log('AudioWorkletNode created and connected.');

            workletNode.port.onmessage = (event) => {
                // console.log('Received audio data from worklet:', event.data);
                if (!sessionRef.current || connectionStatus !== 'connected') {
                    setUserVolume(0);
                    return;
                }

                if (event.data.type === 'volume') {
                    setUserVolume(event.data.volume);
                } else if (event.data.type === 'audio-data' && !isMuted) {
                    console.log('Sending audio data to session...');
                    // Send matching index.tsx format
                    sessionRef.current.sendRealtimeInput({
                        audio: {
                            data: encode(new Uint8Array(event.data.data)),
                            mimeType: 'audio/pcm;rate=16000',
                        }
                    });
                    console.log('Audio data sent.');
                }
            };

            console.log('Connecting audio nodes...');
            source.connect(workletNode);
            workletNode.connect(inCtx.destination);
        } catch (err) {
            console.error('Mic capture failed:', err);
            toast.error('Could not access microphone.');
        }
    }

    // Lifecycle Management
    useEffect(() => {
        if (viewState === 'call' && user && token && !ephemeralToken) {
            dispatch(generateEphemeralToken(token))
        }
    }, [viewState, user, token, ephemeralToken, dispatch])

    useEffect(() => {
        if (viewState === 'call' && ephemeralToken && user && token && !currentSession) {
            dispatch(startLiveSessionAction(token))
        }
    }, [viewState, ephemeralToken, user, token, currentSession, dispatch])

    useEffect(() => {
        // Trigger connection only once when all prerequisites are met
        if (viewState === 'call' && ephemeralToken && currentSession && !sessionRef.current && !connectingRef.current) {
            initSession()
        }
    }, [viewState, ephemeralToken, currentSession, initSession])

    useEffect(() => {
        return () => cleanupAll();
    }, [cleanupAll]);

    const toggleMute = () => {
        if (streamRef.current) {
            const track = streamRef.current.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                dispatch(setMuted(!track.enabled));
                if (!track.enabled) setUserVolume(0);
            }
        }
    }

    const endSession = () => {
        if (currentSession && token) {
            dispatch(endLiveSessionAction({
                sessionId: currentSession.id,
                data: { summary: "Session completed", keyConcepts: [] },
                token
            }))
        }
        cleanupAll();
        dispatch(clearCurrentSession());
        dispatch(clearCaptions());
        setViewState('lobby');
        setShowEndDialog(false);
    }

    const LobbyView = () => (
        <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="relative">
                <Image src="/gifs/robot.gif" alt="AI Tutor" width={120} height={120} unoptimized className="rounded-full border-4 border-primary/20" />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2"><Brain className="w-6 h-6" /></div>
            </div>
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-4xl font-bold">Stable Live Tutor</h1>
                <p className="text-xl text-muted-foreground">Enhanced connectivity for uninterrupted learning sessions.</p>
            </div>
            <Button onClick={() => setViewState('call')} size="lg" className="px-8 py-6 text-lg font-semibold">
                <Play className="w-6 h-6 mr-2" /> Start Tutoring
            </Button>
        </div>
    );

    const CallView = () => (
        <div className="flex flex-col h-[85vh] bg-background border rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b bg-card">
                <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="font-semibold text-sm uppercase tracking-wider">{connectionStatus}</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setShowEndDialog(true)}>End Session</Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-muted/10 relative">
                    <div className="relative">
                        {/* Robot Animation Pulse */}
                        <div
                            className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-all duration-75"
                            style={{
                                transform: `scale(${1 + userVolume * 2})`,
                                opacity: isMuted ? 0 : Math.min(userVolume * 5, 0.8)
                            }}
                        />
                        <div className="relative w-64 h-64">
                            <Image
                                src="/gifs/robot.gif"
                                alt="AI Tutor"
                                fill
                                unoptimized
                                className="rounded-2xl object-cover border-4 border-primary/20 shadow-lg transition-transform duration-75"
                                style={{ transform: `scale(${1 + userVolume * 0.1})` }}
                            />
                        </div>
                    </div>

                    {captions.length > 0 && (
                        <div className="absolute bottom-8 left-8 right-8 bg-black/80 text-white p-6 rounded-xl backdrop-blur-md">
                            <p className="text-lg text-center leading-relaxed">
                                <span className="text-primary font-bold mr-2">Tutor:</span>
                                {captions[captions.length - 1]}
                            </p>
                        </div>
                    )}
                </div>

                <div className="w-80 border-l bg-card p-6 flex flex-col items-center space-y-6">
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center text-muted-foreground">
                        {isVideoEnabled ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" /> : <User className="w-12 h-12 opacity-20" />}
                    </div>
                    <div className="text-center">
                        <p className="font-bold">Student View</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-75"
                                    style={{ width: `${Math.min(userVolume * 300, 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">Voice Level</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t p-6 bg-card">
                <div className="flex items-center justify-center space-x-6">
                    <Button
                        variant={!isMuted ? "primary" : "destructive"}
                        size="md"
                        onClick={toggleMute}
                        className="w-16 h-16 rounded-full shadow-lg"
                    >
                        {!isMuted ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                    </Button>
                    <Button
                        variant={isVideoEnabled ? "primary" : "secondary"}
                        size="md"
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        className="w-16 h-16 rounded-full shadow-lg"
                    >
                        {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                    </Button>
                    {connectionStatus === 'error' && (
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => { cleanupAll(); initSession(); }}
                            className="w-16 h-16 rounded-full border-primary text-primary"
                        >
                            <RefreshCw className="w-6 h-6" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="flex">
                <DashboardSidebar activeTab="live-tutor" />
                <main className="flex-1 p-8">
                    {viewState === 'lobby' ? <LobbyView /> : <CallView />}

                    <DialogProvider open={showEndDialog} onOpenChange={setShowEndDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>End Tutoring Session?</DialogTitle>
                                <DialogDescription>This will finalize your learning summary and generate study materials.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="ghost" onClick={() => setShowEndDialog(false)}>Continue Session</Button>
                                <Button variant="destructive" onClick={endSession}>End & Save</Button>
                            </DialogFooter>
                        </DialogContent>
                    </DialogProvider>
                </main>
            </div>
        </div>
    )
}
