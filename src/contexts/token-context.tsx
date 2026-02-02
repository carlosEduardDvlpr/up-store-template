"use client";

import { parseCookies, setCookie } from "nookies";

import { ToastError } from "@/components/Toaster/toast-error";
import { User } from "@/data/types/token";
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { signInUser } from "@/clients/database/sign-in";
import { refreshSessionToken } from "@/clients/database/refresh-user-session";

interface UserContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (data: { email: string; password: string }) => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Credenciais inválidas",
  PENDING_APPROVAL:
    "Aprovação pendente, aguarde ou entre em contato com o suporte.",
  SERVER_ERROR: "Erro no servidor, tente novamente mais tarde",
  SIGNOUT_FAILED: "Falha ao sair. Tente novamente.",
  REFRESH_FAILED: "Falha ao validar usuário, tente novamente mais tarde.",
};

// Initialize the context with `null` as default
const UserContext = createContext<UserContextProps | null>(null);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setIsLoading(true);
      const { "dzns.ecommerce.user": token } = parseCookies();
      const refreshSession = async () => {
        if (token) {
          const data = await refreshSessionToken();
          if (!data) {
            ToastError({
              title: "Autenticação do usuário",
              description: AUTH_ERROR_MESSAGES.SERVER_ERROR,
            });

            setCookie(undefined, "dzns.ecommerce.user", "", {
              maxAge: 0,
            });
            setUser(null);
            return null;
          }
          setCookie(undefined, "dzns.ecommerce.user", data.token, {
            maxAge: data.maxAge,
            secure: true,
            priority: "high",
            sameSite: true,
          });
          setUser(data);
        }
      };
      refreshSession();
    } catch (err) {
      console.error("[REFRESH TOKEN]", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized signIn function to prevent recreation on each render
  const signIn = useCallback(
    async (data: { email: string; password: string }): Promise<User | null> => {
      try {
        setIsLoading(true);
        const userData = await signInUser(data);
        if (!userData) {
          ToastError({
            title: "Autenticação do usuário",
            description: AUTH_ERROR_MESSAGES.SERVER_ERROR,
          });
          return null;
        }
        setCookie(undefined, "dzns.ecommerce.user", userData.token, {
          secure: true,
          maxAge: userData.maxAge,
          sameSite: true,
          priority: "high",
        });
        setUser(userData);
        return userData;
      } catch (error) {
        console.error("[signInUser]", JSON.stringify(error));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // Handle sign out
  // Memoized signOut function
  const signOut = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setCookie(undefined, "dzns.ecommerce.user", "", {
      secure: true,
      maxAge: 0,
      sameSite: true,
      priority: "high",
    });
    setUser(null);
    setIsLoading(false);
  }, []);

  // Expose both user and handleSignOut in context
  return (
    <UserContext.Provider value={{ user, signIn, signOut, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use user context easily
export function useTokenContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
}
