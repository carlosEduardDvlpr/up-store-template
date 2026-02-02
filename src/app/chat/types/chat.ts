// src/types/chat.ts

export interface InitializationState {
  audioInitialized: boolean
  welcomeMessageSent: boolean
  error: string | null
}

interface Tip {
  text: string
  translation: string
}

export interface EmmaMessage {
  translation: string
  tip?: Tip
}

interface Suggestion {
  status: 'correct' | 'incorrect'
  score: number
  message: string
  hint: string
}

export interface YouMessage {
  suggestion?: Suggestion
}

export interface Message {
  id: string
  speaker: 'You' | 'Emma'
  text: string
  timestamp: string
  emma?: EmmaMessage
  you?: YouMessage
}

export interface AudioState {
  isRecording: boolean
  recordingComplete: boolean
  isProcessing: boolean
  isSpeaking: boolean
  isMuted: boolean
}
