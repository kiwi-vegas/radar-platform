import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RADAR Training Platform',
  description: 'Performance-based learning for real estate professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-tx-primary antialiased">{children}</body>
    </html>
  )
}
