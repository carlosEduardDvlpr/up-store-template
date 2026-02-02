'use client'

import { useState } from 'react'
import { Mic, SendHorizonal } from 'lucide-react'
import { useRecording } from '../../hooks/useRecording'
import { useAudio } from '../../contexts/audio-context'
import { useChatFlow } from '../../hooks/useChatFlow'

import { useChat, Message } from '../../contexts/chat-context'
import { v4 as uuidv4 } from 'uuid'
import { getChatHistory, saveChatHistory } from '../../utils/chat'
import { useTokenContext } from '@/contexts/token-context'
import { Textarea } from '@/components/TextArea'
import { motion } from 'framer-motion'
import {
  backgroundVariant,
  firstTextVariant,
} from '@/components/Cart/animations/variants'
import { ToastError } from '@/components/Toaster/toast-error'

export default function ChatControls() {
  const [message, setMessage] = useState('')
  const { user } = useTokenContext()
  const userId = user?.id

  const {
    audioState,
    setAudioState,
    mediaRecorderRef,
    audioChunksRef,
    // playAudio,
  } = useAudio()

  const {
    // messages,
    addMessage,
  } = useChat()

  const { handleChatFlow } = useChatFlow(
    async (text, speaker, emma, you) => {
      // Create new message object
      const newMessage = {
        text,
        speaker,
        emma,
        you,
        timestamp: new Date().toISOString(),
      }

      addMessage({
        message: {
          id: uuidv4(),
          speaker,
          text,
          timestamp: new Date().toISOString(),
        },
      })

      // Retrieve chat history from localStorage
      const chatHistory = getChatHistory()

      // Add new message to the chat history
      const updatedChatHistory = [...chatHistory, newMessage]

      // Save updated chat history to localStorage
      saveChatHistory(updatedChatHistory)
    },
    setAudioState,
    // playAudio,
  )

  const fetchAIResponse = async (message: string): Promise<string> => {
    const roleplay = {
      name: 'Retail clothes seller',
    }

    // Retrieve chat history
    const chatHistory = getChatHistory()

    // // Build conversation context as an array of objects with 'role' and 'content'
    const conversationContext = chatHistory.map((msg: Message) => ({
      role: msg.speaker === 'Emma' ? 'assistant' : 'user',
      content: msg.text,
    }))

    const payload = { message, roleplay, conversationContext, userId }

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

  const { startRecording, stopRecording } = useRecording(
    mediaRecorderRef,
    audioChunksRef,
    setAudioState,
    handleChatFlow,
    'pt',
  )

  const handleSendMessage = async () => {
    if (!message) {
      ToastError({
        title: 'Mensagem inválida',
        description: 'Por favor, digite uma mensagem para enviar',
      })
      return
    }
    addMessage({
      message: {
        id: uuidv4(),
        speaker: 'You',
        text: message,
        timestamp: new Date().toISOString(),
      },
    })
    setMessage('')
    const aiResponse = await fetchAIResponse(message)
    addMessage({
      message: {
        id: uuidv4(),
        speaker: 'Emma',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      },
    })
  }

  const handleToggleRecording = () => {
    if (audioState.isSpeaking) return

    if (audioState.isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // const handleRepeatMessage = () => {
  //   if (audioState.isSpeaking) return

  //   if (audioState.isRecording) return

  //   if (messages.length > 0) {
  //     const lastMessage = messages[messages.length - 1]
  //     if (lastMessage.speaker === 'Emma') {
  //       setAudioState((prev) => ({ ...prev, isSpeaking: true }))
  //       playAudio(lastMessage.text)
  //     }
  //   }
  // }

  return (
    <div className="w-full p-3 bg-transparent">
      <div className="flex flex-col items-center h-30 space-y-4 bg-transparent backdrop-blur-lg py-8 rounded-none">
        {/* Input field with Reset button */}
        <div className="flex items-center w-full px-4 h-20">
          <Textarea
            placeholder="Envie uma mensagem"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ cursor: 'text' }}
          />
          <div className="flex flex-col justify-between space-y-4 ml-4 w-16">
            <motion.button
              type="button"
              onClick={handleSendMessage}
              initial="initial"
              animate="animate"
              whileTap="tap"
              variants={backgroundVariant}
              className={`w-full py-1 md:py-2.5 rounded-none border border-gray-300 text-lg font-base select-none overflow-hidden relative disabled:bg-gray-200 ${
                audioState.isSpeaking ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Press to send message"
            >
              <div className="overflow-hidden relative h-6">
                <motion.p
                  variants={firstTextVariant}
                  className="relative flex justify-center items-center text-center text-base md:text-lg"
                >
                  <SendHorizonal className="w-6 h-6 text-gray-500" />
                </motion.p>
              </div>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleToggleRecording}
              initial="initial"
              animate="animate"
              whileTap="tap"
              variants={backgroundVariant}
              disabled={audioState.isSpeaking}
              className={`w-full py-1 md:py-2.5 rounded-none border border-gray-300 text-lg font-base select-none overflow-hidden relative disabled:bg-gray-200 ${
                audioState.isRecording ? 'border-green-500' : 'border-gray-300'
              } ${
                audioState.isSpeaking ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Press to send message"
            >
              <div className="overflow-hidden relative h-6">
                <motion.p
                  variants={firstTextVariant}
                  className="relative flex justify-center items-center text-center text-base md:text-lg"
                >
                  <Mic
                    className={`w-6 h-6 font-bold ${
                      audioState.isRecording ? 'text-green-500' : 'text-gray'
                    }`}
                  />
                </motion.p>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
