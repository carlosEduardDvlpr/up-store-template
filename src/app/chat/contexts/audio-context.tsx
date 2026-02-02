// src/context/AudioContext.tsx
'use client'

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react'
import { AudioState } from '../types/chat'

interface AudioContextProps {
  audioState: AudioState
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>
  audioRef: React.MutableRefObject<HTMLAudioElement | null>
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>
  audioChunksRef: React.MutableRefObject<Blob[]>
  playAudio: (text: string, language?: string) => Promise<void>
  toggleMute: () => void
  initializeAudio: () => Promise<() => void>
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined)

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isRecording: false,
    recordingComplete: false,
    isProcessing: false,
    isSpeaking: false,
    isMuted: false,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const initializeAudio = useCallback(async () => {
    audioRef.current = new Audio()
    audioRef.current.crossOrigin = 'anonymous'
    audioRef.current.preload = 'auto'

    audioRef.current.onplay = () =>
      setAudioState((prev) => ({ ...prev, isSpeaking: true }))
    audioRef.current.onended = () =>
      setAudioState((prev) => ({ ...prev, isSpeaking: false }))
    audioRef.current.onerror = () =>
      setAudioState((prev) => ({ ...prev, isSpeaking: false }))

    return () => {
      if (audioRef.current) {
        audioRef.current.onplay = null
        audioRef.current.onended = null
        audioRef.current.onerror = null
      }
    }
  }, [])

  const playAudio = useCallback(
    async (text: string, language?: string) => {
      if (!audioState.isMuted) {
        try {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
          }

          const response = await fetch('/api/chat/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: language ?? 'en-US' }),
          })

          if (!response.ok) throw new Error('Failed to generate speech')

          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)

          if (!audioRef.current) {
            audioRef.current = new Audio()
          }

          audioRef.current.crossOrigin = 'anonymous'
          audioRef.current.preload = 'auto'
          audioRef.current.src = audioUrl

          const playPromise = audioRef.current.play()
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setAudioState((prev) => ({ ...prev, isSpeaking: true }))
              })
              .catch((error) => {
                console.error('Audio playback failed:', error)
                setAudioState((prev) => ({ ...prev, isSpeaking: false }))
              })
          }
        } catch (error) {
          console.error('Error playing audio:', error)
          setAudioState((prev) => ({ ...prev, isSpeaking: false }))
        }
      }
    },
    [audioState.isMuted],
  )

  const toggleMute = useCallback(() => {
    if (audioState.isSpeaking && !audioState.isMuted && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setAudioState((prev) => ({ ...prev, isMuted: !prev.isMuted }))
  }, [audioState.isSpeaking, audioState.isMuted])

  const value = {
    audioState,
    setAudioState,
    audioRef,
    mediaRecorderRef,
    audioChunksRef,
    playAudio,
    toggleMute,
    initializeAudio,
  }

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
