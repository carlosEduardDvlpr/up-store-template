"use client";

import React, { useEffect, useState } from "react";

import ChatHeader from "./chat-header";
import ChatControls from "./chat-controls";
import StatusIndicators from "./chat-indicator";
import ChatMessage from "./chat-message";
import { useChat } from "../../contexts/chat-context";
import { useTokenContext } from "@/contexts/token-context";

export default function ChatComponent() {
  const { user } = useTokenContext();
  const { messages, messagesEndRef } = useChat();
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const [isLessonActive, setIsLessonActive] = useState(false);

  useEffect(() => {
    // Optionally: Scroll to the bottom to show the latest message
    const element = messagesEndRef.current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesEndRef]); // Empty dependency array ensures this runs once on component mount

  //
  // Handle the scroll to end of the lesson
  //
  useEffect(() => {
    const element = messagesEndRef.current;
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesEndRef]);

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end z-50">
      {/* Chat Button (Hidden when chat is open or button is hidden) */}
      {!isOpen && isButtonVisible && (
        <div className="relative">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-grey-800 transition-all opacity-40 hover:opacity-100"
          >
            <span className="text-2xl font-light italic">A</span>
          </button>
          <button
            onClick={() => setIsButtonVisible(false)}
            className="absolute top-1 right-1 bg-red-300 text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center shadow-md hover:bg-red-600"
            aria-label="Hide chat button"
          >
            ×
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] lg:w-[50vw] max-h-[85vh] bg-white rounded-sm shadow-xl overflow-hidden flex flex-col border border-gray-300 transition-all animate-fade-in h-screen bg-gradient-to-br from-gray-50 to-gray-200">
          <ChatHeader
            isLessonActive={isLessonActive}
            setIsLessonActive={setIsLessonActive}
            setIsOpen={setIsOpen}
          />

          {/* Messages */}
          <div className="flex flex-col flex-grow overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Status Indicators */}
            <StatusIndicators />
          </div>

          {/* Controls */}
          <ChatControls />
        </div>
      )}
    </div>
  );
}
