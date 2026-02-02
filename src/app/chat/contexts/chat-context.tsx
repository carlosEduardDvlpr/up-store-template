"use client";

import { ToastError } from "@/components/Toaster/toast-error";
import { User } from "@/data/types/token";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export interface Message {
  id: string;
  speaker: "You" | "Emma";
  text: string;
  timestamp: string;
}

interface ChatProps {
  message: Message | null;
  user?: User | null;
}

interface ChatContextType {
  messages: Message[];
  addMessage: ({ message, user }: ChatProps) => void;
  deleteMessages: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const getChatHistory = (): Message[] => {
  if (typeof window === "undefined") return [];
  const chatHistory = localStorage.getItem("chatHistory");
  return chatHistory ? (JSON.parse(chatHistory) as Message[]) : [];
};

const saveChatHistory = (messages: Message[]) => {
  localStorage.setItem("chatHistory", JSON.stringify(messages));
};

const clearChatHistory = () => {
  localStorage.removeItem("chatHistory");
};

const ChatContext = createContext({} as ChatContextType);

export function ChatProvider({ children }: { children: ReactNode }) {
  // ✅ lazy init: sem useEffect, sem lint error
  const [messages, setMessages] = useState<Message[]>(() => getChatHistory());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // opcional: se quiser persistir inclusive quando ficar vazio, remova o if
    if (messages.length > 0) saveChatHistory(messages);
  }, [messages]);

  function addMessage({ message }: ChatProps) {
    if (!message) {
      ToastError({
        title: "Erro ao adicionar mensagem",
        description: "Mensagem inválida",
      });
      return;
    }

    setMessages((state) => [...state, message]);
  }

  function deleteMessages() {
    setMessages([]);
    clearChatHistory();
  }

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, deleteMessages, messagesEndRef }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
