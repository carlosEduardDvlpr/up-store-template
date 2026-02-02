import { useCallback } from 'react'

import { AudioState, EmmaMessage, YouMessage } from '../types/chat'
import { getChatHistory } from '../utils/chat'

interface Message {
  text: string
  speaker: 'You' | 'Emma'
  emma: EmmaMessage
  you: YouMessage
}

export const useChatFlow = (
  addMessageToChatFlow: (
    text: string,
    speaker: 'You' | 'Emma',
    emma?: EmmaMessage,
    you?: YouMessage,
  ) => Promise<void>,
  setAudioState: React.Dispatch<React.SetStateAction<AudioState>>,
  // playAudio: (text: string) => Promise<void>,
) => {
  const handleChatFlow = useCallback(
    async (userMessage: string) => {
      const roleplay = {
        name: 'Retail clothes seller',
      }

      const fetchAIResponse = async (message: string) => {
        // Retrieve chat history
        const chatHistory = getChatHistory()

        // Build conversation context as an array of objects with 'role' and 'content'
        const conversationContext = chatHistory.map((msg: Message) => ({
          role: msg.speaker === 'Emma' ? 'assistant' : 'user',
          content: msg.text,
        }))

        const payload = { message, roleplay, conversationContext }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch AI response')
        }

        const data = await response.json()
        return data.text || ''
      }

      // Update audio state to processing
      setAudioState((prev) => ({ ...prev, isProcessing: true }))

      try {
        // Add user's message to the chat
        await addMessageToChatFlow(userMessage, 'You')

        // Fetch AI response
        const aiResponse = await fetchAIResponse(userMessage)

        // Add Emma's message to the chat
        await addMessageToChatFlow(aiResponse, 'Emma')

        // // Play the AI response audio
        // await playAudio(aiResponse)
      } catch (error) {
        console.error('Error in chat flow:', error)
        await addMessageToChatFlow(
          'Desculpe, não pude processar a requisição.',
          'Emma',
        )
      } finally {
        // Reset audio state
        setAudioState((prev) => ({ ...prev, isProcessing: false }))
      }
    },
    [
      addMessageToChatFlow,
      setAudioState,
      // playAudio
    ],
  )

  return { handleChatFlow }
}
