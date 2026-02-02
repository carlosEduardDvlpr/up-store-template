// src/utils/api.ts
export const transcribeAudio = async (audioBlob: Blob, language: string) => {
  const formData = new FormData()
  formData.append('audio', audioBlob)
  formData.append('language', language)

  const response = await fetch('/api/chat/stt', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) throw new Error('Failed to transcribe audio')
  return response.json()
}

export const generateSpeech = async (text: string) => {
  const response = await fetch('/api/chat/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) throw new Error('Failed to generate speech')
  return response.blob()
}
