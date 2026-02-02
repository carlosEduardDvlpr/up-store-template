"use client";

import { Message } from "../../types/chat";
import { Volume2Icon } from "lucide-react";
import { useAudio } from "../../contexts/audio-context";
import ReactMarkdown from "react-markdown";

export default function ChatMessage({ message }: { message: Message }) {
  const isUser = message.speaker === "You";

  const { audioState, setAudioState, playAudio } = useAudio();

  // Common styles for message bubbles
  const bubbleBaseStyle = "max-w-[80%] rounded-lg px-4 py-3 shadow-md";
  const userBubbleStyle =
    "bg-gradient-to-br from-gray-500 to-gray-800 text-white rounded-tr-none";
  const emmaBubbleStyle =
    "bg-gradient-to-br from-white to-gray-100 text-gray-600 rounded-tl-none";

  const handleSpeaking = (text: string) => {
    if (audioState.isSpeaking) return;
    if (audioState.isRecording) return;

    setAudioState((prev) => ({ ...prev, isSpeaking: true }));
    playAudio(text);
  };

  return (
    <>
      {/* Main Message Bubble */}
      <div
        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
        key={message.id}
      >
        <div
          className={`${bubbleBaseStyle} ${
            isUser ? userBubbleStyle : emmaBubbleStyle
          }`}
        >
          {/* Render message text with Markdown support */}
          <div className="text-sm">
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    className="text-gray-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Action Buttons for Main message */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
              <button
                onClick={() => handleSpeaking(message.text ?? "")}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                title="Translation"
              >
                <Volume2Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
