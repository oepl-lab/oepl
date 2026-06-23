"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { LangProvider } from "@/contexts/LangContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>
        <ContentProvider>{children}</ContentProvider>
      </AuthProvider>
    </LangProvider>
  );
}
