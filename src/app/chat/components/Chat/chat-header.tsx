'use client'

import { useState } from 'react'

// import { useAudio } from '../../contexts/audio-context'
import {
  XIcon,
  // Trash,
  // Volume2,
  // VolumeX
} from 'lucide-react'
import { ConfirmModal } from '../../components/Modals/chat-confirmation'
import { useChat } from '../../contexts/chat-context'

interface ChatHeaderProps {
  isLessonActive: boolean
  setIsLessonActive: (value: boolean) => void
  setIsOpen: (value: boolean) => void
}

export default function ChatHeader({
  isLessonActive,
  setIsLessonActive,
  setIsOpen,
}: ChatHeaderProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const { deleteMessages } = useChat()

  // const { audioState } = useAudio()

  const handleReturn = () => {
    setIsConfirmModalOpen(true)
  }

  const handleConfirmReturn = () => {
    if (isLessonActive === true) {
      setIsLessonActive(false)
    }
    deleteMessages()
    setIsOpen(false)
  }

  // const handleDeleteChatHistory = () => {
  //   deleteMessages()
  // }

  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="ml-2 text-xl font-semibold text-gray-700 uppercase">
            Assistente Virtual
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100"
            title={audioState.isMuted ? 'Unmute' : 'Mute'}
          >
            {audioState.isMuted ? (
              <VolumeX className="w-6 h-6 text-gray-700" />
            ) : (
              <Volume2 className="w-6 h-6 text-gray-700" />
            )}
          </button> */}
          <div>
            {/* <button
              onClick={() => handleDeleteChatHistory()}
              className="p-2 rounded-full hover:bg-gray-100"
              title={audioState.isMuted ? 'Unmute' : 'Mute'}
            >
              {audioState.isMuted ? (
                <Trash className="w-6 h-6 text-gray-700" />
              ) : (
                <Trash className="w-6 h-6 text-gray-700" />
              )}
            </button> */}
            <button onClick={handleReturn} className="p-2">
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmReturn}
        title="Sair do Chat"
        description="Ao sair do chat você vai finalizar o atendimento."
        variant="exit"
      />
    </>
  )
}
