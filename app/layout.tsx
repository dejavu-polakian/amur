import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Instrument_Serif, Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Амур — знакомства с характером",
  description: "Амур — элегантный сервис знакомств для тех, кто знает, чего хочет.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fae3e6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${instrumentSerif.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
