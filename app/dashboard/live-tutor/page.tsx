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

// Helper functions matching the example utils.ts
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

function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        // convert float32 -1 to 1 to int16 -32768 to 32767
        int16[i] = data[i] * 32768;
    }

    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const buffer = ctx.createBuffer(
        numChannels,
        data.length / 2 / numChannels,
        sampleRate,
    );

    const dataInt16 = new Int16Array(data.buffer);
    const l = dataInt16.length;
    const dataFloat32 = new Float32Array(l);
    for (let i = 0; i < l; i++) {
        dataFloat32[i] = dataInt16[i] / 32768.0;
    }
    // Extract interleaved channels
    if (numChannels === 1) {
        buffer.copyToChannel(dataFloat32, 0);
    } else {
        for (let i = 0; i < numChannels; i++) {
            const channel = dataFloat32.filter(
                (_, index) => index % numChannels === i,
            );
            buffer.copyToChannel(channel, i);
        }
    }

    return buffer;
}

type ViewState = 'lobby' | 'call'

export default function LiveTutorPage() {
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
    const [isAISpeaking, setIsAISpeaking] = useState(false)

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
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
    const scriptProcessorNodeRef = useRef<AudioWorkletNode | null>(null)
    const hasGreetedRef = useRef(false)
    const connectionStatusRef = useRef(connectionStatus);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup Logic
    const cleanupAudio = useCallback(() => {
        console.log('🧹 Cleaning up audio...');
        sourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { }
        });
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;

        if (scriptProcessorNodeRef.current && sourceNodeRef.current) {
            try {
                scriptProcessorNodeRef.current.disconnect();
                sourceNodeRef.current.disconnect();
                console.log('✅ Audio nodes disconnected');
            } catch (e) { }
        }

        scriptProcessorNodeRef.current = null;
        sourceNodeRef.current = null;

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
        console.log('🧹 Cleaning up all resources...');
        cleanupAudio();
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            console.log('✅ Media stream stopped');
        }
        if (sessionRef.current) {
            try { sessionRef.current.close(); } catch (e) { }
            sessionRef.current = null;
            console.log('✅ Session closed');
        }
        connectingRef.current = false;
        hasGreetedRef.current = false;
        setUserVolume(0);
        setIsAISpeaking(false);
    }, [cleanupAudio]);

    // Core Connection Logic
    const initSession = useCallback(async () => {
        if (!ephemeralToken || connectingRef.current || sessionRef.current) {
            console.log('⚠️ Skipping session init:', {
                hasToken: !!ephemeralToken,
                isConnecting: connectingRef.current,
                hasSession: !!sessionRef.current
            });
            return;
        }

        connectingRef.current = true;
        dispatch(setConnectionStatus('connecting'));
        console.log('🔌 Initializing Gemini Live session...');

        try {
            const ai = new GoogleGenAI({
                apiKey: ephemeralToken.token,
                httpOptions: { apiVersion: 'v1alpha' },
            });

            const model = 'gemini-2.5-flash-native-audio-preview-09-2025';
            console.log('🤖 Using model:', model);

            const session = await ai.live.connect({
                model: model,
                callbacks: {
                    onopen: () => {
                        console.log('✅ ===== SESSION OPENED SUCCESSFULLY =====');
                        dispatch(setConnectionStatus('connected'));

                        // Start recording first
                        startRecording();

                        // Send greeting after a small delay to ensure everything is ready
                        setTimeout(() => {
                            if (sessionRef.current && !hasGreetedRef.current) {
                                hasGreetedRef.current = true;
                                console.log('👋 Sending greeting to AI...');
                                sessionRef.current.sendRealtimeInput({
                                    text: "Hi!",
                                });
                            }
                        }, 500);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        console.log('📩 ===== RECEIVED MESSAGE FROM AI =====');
                        console.log({
                            hasTranscription: !!message.serverContent?.outputTranscription,
                            hasModelTurn: !!message.serverContent?.modelTurn,
                            interrupted: !!message.serverContent?.interrupted,
                            turnComplete: !!message.serverContent?.turnComplete
                        });

                        // Handle transcriptions
                        if (message.serverContent?.outputTranscription) {
                            const transcription = message.serverContent.outputTranscription.text;
                            console.log('📝 AI transcription:', transcription);
                            dispatch(addCaption(transcription));
                        }

                        // Handle model turn with audio
                        const modelTurn = message.serverContent?.modelTurn;
                        if (modelTurn?.parts) {
                            console.log('🎵 Processing', modelTurn.parts.length, 'parts from AI');
                            for (const part of modelTurn.parts) {
                                // Extract text
                                if (part.text) {
                                    console.log('💬 AI text response:', part.text);
                                    dispatch(addCaption(part.text));
                                }

                                // Extract and play audio
                                const audio = part.inlineData;
                                if (audio?.data && outputAudioContextRef.current && outputNodeRef.current) {
                                    setIsAISpeaking(true);
                                    const ctx = outputAudioContextRef.current;
                                    console.log('🔊 Decoding and playing AI audio...');

                                    try {
                                        nextStartTimeRef.current = Math.max(
                                            nextStartTimeRef.current,
                                            ctx.currentTime
                                        );

                                        const audioBuffer = await decodeAudioData(
                                            decode(audio.data),
                                            ctx,
                                            24000,
                                            1
                                        );

                                        const source = ctx.createBufferSource();
                                        source.buffer = audioBuffer;
                                        source.connect(outputNodeRef.current);
                                        source.addEventListener('ended', () => {
                                            sourcesRef.current.delete(source);
                                            if (sourcesRef.current.size === 0) {
                                                setIsAISpeaking(false);
                                                console.log('✅ AI finished speaking');
                                            }
                                        });

                                        source.start(nextStartTimeRef.current);
                                        nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                                        sourcesRef.current.add(source);

                                        console.log('🔊 Playing AI audio, duration:', audioBuffer.duration.toFixed(2) + 's');
                                    } catch (error) {
                                        console.error('❌ Error playing AI audio:', error);
                                        setIsAISpeaking(false);
                                    }
                                }
                            }
                        }

                        // Handle interruption
                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            console.log('⏸️ AI was interrupted');
                            for (const source of sourcesRef.current.values()) {
                                source.stop();
                                sourcesRef.current.delete(source);
                            }
                            nextStartTimeRef.current = 0;
                            setIsAISpeaking(false);
                        }

                        // Handle turn complete
                        if (message.serverContent?.turnComplete) {
                            console.log('✅ Turn complete - AI is ready to listen');
                            setIsAISpeaking(false);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('❌ ===== SESSION ERROR =====');
                        console.error(e);
                        dispatch(setConnectionStatus('error'));
                        toast.error("Session error: " + e.message);
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('🔌 ===== SESSION CLOSED =====');
                        console.log('Close code:', e.code, 'Reason:', e.reason);
                        dispatch(setConnectionStatus('disconnected'));

                        // Only show toast if it wasn't a normal closure
                        if (e.code !== 1000) {
                            toast.error(`Session closed (${e.code}): ${e.reason || 'Unknown reason'}`);
                        }

                        cleanupAll();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: {
                        parts: [{
                            text: `You are Lexi, an enthusiastic and patient AI tutor. Your goal is to help students learn through interactive conversation.

Guidelines:
- Speak naturally and conversationally, as if talking to a friend
- Keep responses concise (2-3 sentences typically) to maintain engagement
- Ask follow-up questions to check understanding
- Be encouraging and positive
- If you hear unclear audio or background noise, politely ask the student to repeat
- Stay on topic and focused on learning

When the session starts, greet the student warmly and ask what they'd like to learn about.`
                        }]
                    },
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                    },
                },
            });

            sessionRef.current = session;
            console.log('✅ Session stored in ref');

            // Setup Output Audio Context
            const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outGain = outCtx.createGain();
            outGain.connect(outCtx.destination);
            outputAudioContextRef.current = outCtx;
            outputNodeRef.current = outGain;
            nextStartTimeRef.current = outCtx.currentTime;
            console.log('🔊 Output audio context created, sample rate:', outCtx.sampleRate);

        } catch (error) {
            console.error('❌ Failed to init session:', error);
            dispatch(setConnectionStatus('error'));
            connectingRef.current = false;
            toast.error("Failed to connect. Please try again.");
        }
    }, [ephemeralToken, dispatch, cleanupAll]);

    const startRecording = async () => {
        console.log('🎤 ===== STARTING MICROPHONE CAPTURE =====');
        try {
            if (!streamRef.current) {
                console.log('📡 Requesting microphone access...');
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 16000
                    }
                });
                console.log('✅ Microphone access granted');
            }

            const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            inputAudioContextRef.current = inCtx;
            console.log('🔊 Input audio context created, sample rate:', inCtx.sampleRate);

            try {
                console.log('📥 Loading AudioWorklet module from /audio-processor.js...');
                await inCtx.audioWorklet.addModule('/audio-processor.js');
                console.log('✅ AudioWorklet module loaded successfully');
            } catch (workletError) {
                console.error('❌ Failed to load AudioWorklet:', workletError);
                toast.error('Failed to load audio processor. Make sure audio-processor.js is in /public folder');
                return;
            }

            sourceNodeRef.current = inCtx.createMediaStreamSource(streamRef.current);
            console.log('🎵 Media stream source created');

            const workletNode = new AudioWorkletNode(inCtx, 'audio-processor');
            scriptProcessorNodeRef.current = workletNode;
            console.log('🔧 AudioWorkletNode created');

            let silenceCounter = 0;
            const silenceThreshold = 0.01;
            let audioChunksSent = 0;
            let lastLogTime = 0;

            workletNode.port.onmessage = (event) => {
                const now = Date.now();

                // Log periodically to avoid spam
                if (now - lastLogTime > 2000) {
                    console.log('📨 Worklet message:', event.data.type);
                    lastLogTime = now;
                }

                if (!sessionRef.current) {
                    console.warn('⚠️ Session not ready');
                    setUserVolume(0);
                    return;
                }

                if (connectionStatusRef.current !== 'connected') {
                    console.warn('⚠️ Not connected:', connectionStatus);
                    setUserVolume(0);
                    return;
                }

                if (isMuted) {
                    setUserVolume(0);
                    return;
                }

                if (event.data.type === 'volume') {
                    const rms = event.data.volume;
                    setUserVolume(Math.min(rms * 3, 1));

                    if (rms > 0.02 && now - lastLogTime > 2000) {
                        console.log('🔊 Voice detected! Volume:', rms.toFixed(4));
                    }
                } else if (event.data.type === 'audio-data') {
                    const pcmData = new Float32Array(event.data.data);

                    // Calculate RMS
                    let sum = 0;
                    for (let i = 0; i < pcmData.length; i++) {
                        sum += pcmData[i] * pcmData[i];
                    }
                    const rms = Math.sqrt(sum / pcmData.length);

                    // Send if above threshold
                    if (rms > silenceThreshold) {
                        if (isAISpeaking) {
                            if (now - lastLogTime > 2000) {
                                console.log('🤖 AI is speaking, holding user audio');
                            }
                        } else {
                            silenceCounter = 0;
                            try {
                                sessionRef.current.sendRealtimeInput({ media: createBlob(pcmData) });
                                audioChunksSent++;
                                if (audioChunksSent % 10 === 0) {
                                    console.log('✅ Sent', audioChunksSent, 'audio chunks. RMS:', rms.toFixed(4));
                                }
                            } catch (error) {
                                console.error('❌ Error sending audio:', error);
                            }
                        }
                    } else {
                        silenceCounter++;
                        // Keepalive
                        // if (silenceCounter % 50 === 0 && !isAISpeaking) {
                        //     try {
                        //         sessionRef.current.sendRealtimeInput({ media: createBlob(pcmData) });
                        //         console.log('💓 Keepalive sent');
                        //     } catch (error) {
                        //         console.error('❌ Keepalive error:', error);
                        //     }
                        // }
                    }
                }
            };

            workletNode.port.onmessageerror = (error) => {
                console.error('❌ Worklet message error:', error);
            };

            sourceNodeRef.current.connect(workletNode);
            console.log('🔗 Audio nodes connected (no echo)');
            console.log('✅ ===== RECORDING STARTED - SPEAK NOW! =====');
        } catch (err) {
            console.error('❌ Mic capture failed:', err);
            toast.error('Microphone error: ' + (err as Error).message);
        }
    }

    // Lifecycle Management
    useEffect(() => {
        if (viewState === 'call' && user && token && !ephemeralToken) {
            console.log('🔑 Generating ephemeral token...');
            dispatch(generateEphemeralToken(token))
        }
    }, [viewState, user, token, ephemeralToken, dispatch])

    useEffect(() => {
        if (viewState === 'call' && ephemeralToken && user && token && !currentSession) {
            console.log('📝 Starting live session...');
            dispatch(startLiveSessionAction(token))
        }
    }, [viewState, ephemeralToken, user, token, currentSession, dispatch])

    useEffect(() => {
        connectionStatusRef.current = connectionStatus;
    }, [connectionStatus]);

    useEffect(() => {
        if (viewState === 'call' && ephemeralToken && currentSession && !sessionRef.current && !connectingRef.current) {
            console.log('🚀 All prerequisites met, initializing session...');
            initSession()
        }
    }, [viewState, ephemeralToken, currentSession, initSession])

    useEffect(() => {
        return () => {
            console.log('🔄 Component unmounting, cleaning up...');
            cleanupAll();
        }
    }, [cleanupAll]);

    const toggleMute = () => {
        const newMuted = !isMuted;
        dispatch(setMuted(newMuted));
        console.log('🎙️ Mute toggled:', newMuted);
        if (newMuted) setUserVolume(0);
    }

    const endSession = () => {
        console.log('👋 Ending session...');
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
            <div className="relative w-24 h-24">
                <Image src="/gifs/robot.gif" alt="AI Tutor" width={120} height={120} unoptimized className="rounded-full border-4 border-primary/20" />
                {/* <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2"><Brain className="w-5 h-5" /></div> */}
            </div>
            <div className="text-center space-y-4 max-w-2xl">
                <h1 className="text-xl md:text-2xl font-bold">Have a call with Lexi</h1>
                <p className="text-sm md:text-base text-muted-foreground">Real-time voice conversations with your AI learning companion.</p>
            </div>
            <Button onClick={() => setViewState('call')} size="md" className="text-sm md:text-base font-semibold">
                <Play className="w-5 h-5 mr-2" /> Start Call
            </Button>
        </div>
    );

    const CallView = () => (
        <div className="flex flex-col gap-5 h-[90vh] rounded-2xl">
            <div className="flex items-center justify-between p-4 border border-border/10 rounded-3xl">
                <div className="text-xs md:text-sm flex items-center space-x-3">
                    <div className={`rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="font-semibold uppercase tracking-wider">{connectionStatus}</span>
                    {isAISpeaking && <Badge variant="secondary" className="animate-pulse">AI Speaking...</Badge>}
                </div>
                <Button variant="destructive" size="sm" onClick={() => setShowEndDialog(true)}>End Session</Button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="relative">
                        {/* User speaking pulse */}
                        <div
                            className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl transition-all duration-75"
                            style={{
                                transform: `scale(${1 + userVolume * 2})`,
                                opacity: isMuted ? 0 : Math.min(userVolume * 5, 0.8)
                            }}
                        />
                        {/* AI speaking pulse */}
                        {isAISpeaking && (
                            <div className="absolute inset-0 rounded-2xl bg-green-500/30 blur-xl animate-pulse" />
                        )}
                        <div className="relative w-20 h-20">
                            <Image
                                src="/gifs/robot.gif"
                                alt="AI Tutor"
                                fill
                                unoptimized
                                className="rounded-2xl object-cover border-4 border-primary/20 shadow-lg transition-transform duration-75"
                                style={{ transform: `scale(${1 + (isAISpeaking ? 0.05 : userVolume * 0.1)})` }}
                            />
                        </div>
                    </div>

                    {captions.length > 0 && (
                        <div className="absolute bottom-8 left-8 right-8 text-white p-2 md:p-4 rounded-xl backdrop-blur-md max-h-32 overflow-y-auto">
                            <p className="text-xs md:text-sm leading-relaxed">
                                {captions.slice(-3).map((caption, idx) => (
                                    <span key={idx} className="block mb-2">
                                        <span className="text-primary font-bold mr-2">Lexi:</span>
                                        {caption}
                                    </span>
                                ))}
                            </p>
                        </div>
                    )}
                </div>

                {/* <div className="w-80 border-l bg-card p-6 flex flex-col items-center space-y-6"> */}
                    {/* <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center text-muted-foreground">
                        {isVideoEnabled ? <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" /> : <User className="w-12 h-12 opacity-20" />}
                    </div> */}
                    {/* <div className="text-center">
                        <p className="font-bold">Student View</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                            <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-75"
                                    style={{ width: `${Math.min(userVolume * 300, 100)}%` }}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">
                                {isMuted ? 'Muted' : 'Voice Level'}
                            </p>
                        </div>
                    </div> */}

                    {/* Session Info */}
                    {/* <div className="w-full p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-medium">{connectionStatus}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Microphone:</span>
                            <span className="font-medium">{isMuted ? 'Muted' : 'Active'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">AI Status:</span>
                            <span className="font-medium">{isAISpeaking ? 'Speaking' : 'Listening'}</span>
                        </div>
                    </div> */}
                {/* </div> */}
            </div>

            <div className="border border-border/10 rounded-3xl p-4">
                <div className="flex items-center justify-center space-x-6">
                    <Button
                        variant={!isMuted ? "primary" : "destructive"}
                        size="md"
                        onClick={toggleMute}
                        className="rounded-full shadow-lg"
                        disabled={connectionStatus !== 'connected'}
                    >
                        {!isMuted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>
                    <Button
                        variant={isVideoEnabled ? "primary" : "secondary"}
                        size="md"
                        onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                        className="rounded-full shadow-lg"
                        disabled={connectionStatus !== 'connected'}
                    >
                        {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </Button>
                    {connectionStatus === 'error' && (
                        <Button
                            variant="outline"
                            size="md"
                            onClick={() => { cleanupAll(); initSession(); }}
                            className="rounded-full border-primary text-primary"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className="flex">
                <DashboardSidebar activeTab="live-tutor" />
                <main className="flex-1 p-3">
                    {viewState === 'lobby' ? <LobbyView /> : <CallView />}

                    <DialogProvider open={showEndDialog} onOpenChange={setShowEndDialog}>
                        <DialogContent>
                            <DialogHeader className="p-0">
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