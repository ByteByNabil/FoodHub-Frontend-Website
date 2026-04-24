"use client";

import { createContext, useContext, type ReactNode } from "react";
import useSWR from "swr";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCustomer: boolean;
  isProvider: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession();
  const sessionUser = session?.user as Partial<User> | null | undefined;

  const shouldLoadFullSessionUser =
    !!sessionUser &&
    (!sessionUser.role || !sessionUser.status || !sessionUser.createdAt || !sessionUser.updatedAt);

  const { data: fullSessionData, isLoading: isLoadingFullSessionUser } = useSWR(
    shouldLoadFullSessionUser ? "auth-full-session-user" : null,
    () => api.getSession(),
    { revalidateOnFocus: false },
  );

  const user = sessionUser
    ? ({
        ...fullSessionData?.user,
        ...sessionUser,
        role: sessionUser.role ?? fullSessionData?.user?.role,
        status: sessionUser.status ?? fullSessionData?.user?.status,
        createdAt: sessionUser.createdAt ?? fullSessionData?.user?.createdAt,
        updatedAt: sessionUser.updatedAt ?? fullSessionData?.user?.updatedAt,
      } as User)
    : null;
  const isAuthenticated = !!user;
  const isCustomer = user?.role === "CUSTOMER";
  const isProvider = user?.role === "PROVIDER";
  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending || isLoadingFullSessionUser,
        isAuthenticated,
        isCustomer,
        isProvider,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
