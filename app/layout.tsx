import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Binary Search Tree Visualization - Developed By SSO',
  description: 'Explore and visualize Binary Search Trees interactively. Developed by Team SSO (Pun Solita, Meng Oudom, Khoun Sovansunchhay) - Team 01 MCS02 CADT. Perfect for learning data structures.',
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
    title: 'Binary Search Tree Visualization - Developed By SSO',
    description: 'Explore and visualize Binary Search Trees interactively. Developed by Team SSO (Pun Solita, Meng Oudom, Khoun Sovansunchhay) - Team 01 MCS02 CADT. Perfect for learning data structures.',
    siteName: 'BST Visualizer by Team SSO',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/bst_sso.png',
        width: 1200,
        height: 630,
        alt: 'Binary Search Tree Visualization Preview',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Binary Search Tree Visualization - Developed By SSO',
    description: 'Explore and visualize Binary Search Trees interactively. Developed by Team SSO (Pun Solita, Meng Oudom, Khoun Sovansunchhay) - Team 01 MCS02 CADT. Perfect for learning data structures.',
    images: ['/bst_sso.png'],
  },
  metadataBase: new URL('https://bst.oudommeng.me'),
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
