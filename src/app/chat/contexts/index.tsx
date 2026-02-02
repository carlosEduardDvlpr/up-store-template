// src/providers/index.ts
import React from 'react'
import { AudioProvider } from './audio-context'
import { AudioGCPProvider } from './audio-gcp-context'
import { ChatProvider } from './chat-context'

export const ChatProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <AudioProvider>
    <AudioGCPProvider>
      <ChatProvider>{children}</ChatProvider>
    </AudioGCPProvider>
  </AudioProvider>
)
