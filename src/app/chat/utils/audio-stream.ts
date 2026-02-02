interface Window {
  webkitAudioContext?: AudioContext
}

export const initializeAudioContext = () => {
  try {
    const AudioContext =
      window.AudioContext || (window as Window).webkitAudioContext
    const audioContext = new AudioContext()

    // Resume audio context on user interaction
    document.addEventListener(
      'touchstart',
      () => {
        if (audioContext.state === 'suspended') {
          audioContext.resume()
        }
      },
      { once: true },
    )

    return audioContext
  } catch (error) {
    console.error('WebView AudioContext initialization failed:', error)
    return null
  }
}

export const getAudioStream = () => {
  return navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 44100,
    },
  })
}
