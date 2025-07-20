import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Feedback",
  description: "Real feedback from real people.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          {children}
          <Toaster
              richColors
              toastOptions={{
                duration: 3000,
                classNames: {
                  toast: "rounded-xl px-5 py-4 shadow-lg border text-sm",
                  description: "mt-1 text-muted-foreground",
                  success: "bg-green-100 text-green-900 border-green-200",
                  error: "bg-red-100 text-red-900 border-red-200",
                  warning: "bg-yellow-100 text-yellow-900 border-yellow-200",
                  info: "bg-blue-100 text-blue-900 border-blue-200",
                }
              }}
          />
        </body>
      </AuthProvider>
    </html>
  );
}
