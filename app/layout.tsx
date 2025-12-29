import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'BST Visualizer',
  description: 'Interactive Binary Search Tree Visualizer by Team 01 - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
  authors: [
    { name: 'Pun Solita' },
    { name: 'Meng Oudom' },
    { name: 'Khoun Sovansunchhay' }
  ],
  keywords: ['Binary Search Tree', 'BST', 'Visualizer', 'CADT', 'Data Structures', 'Algorithm'],
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'BST Visualizer',
    description: 'Interactive Binary Search Tree Visualizer by Team 01 - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
    images: ['/bst_sso.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BST Visualizer',
    description: 'Interactive Binary Search Tree Visualizer by Team 01 - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
    images: ['/bst_sso.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
