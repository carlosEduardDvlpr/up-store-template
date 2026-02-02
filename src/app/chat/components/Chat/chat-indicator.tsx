'use client'

import { useAudio } from '../../contexts/audio-context'

export default function StatusIndicators() {
  const { audioState } = useAudio()

  return (
    <>
      {audioState.isRecording && (
        <div className="flex items-center justify-center mt-4 text-indigo-800">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Recording...</span>
          </div>
        </div>
      )}

      {audioState.isProcessing && (
        <div className="flex items-center pb-28 justify-center mt-4 text-indigo-800">
          <div className="animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </>
  )
}
