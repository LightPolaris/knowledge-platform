import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import "./globals.css"
import { Suspense } from "react"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "600"],
})

export const metadata: Metadata = {
  title: "知识平台 - 东方电气集团",
  description: "锅炉事业部智能知识管理平台",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`font-sans ${sourceSans.variable} ${playfairDisplay.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem={false} disableTransitionOnChange storageKey="theme">
            {children}
          </ThemeProvider>
        </Suspense>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  )
}
