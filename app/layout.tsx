import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Binary Search Tree Visualization - By SSO',
  description: 'Interactive Binary Search Tree Visualizer by Team 01 CADT - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
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
    title: 'Binary Search Tree Visualization - By SSO',
    description: 'Interactive Binary Search Tree Visualizer by Team 01 - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
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
    title: 'Binary Search Tree Visualization - By SSO',
    description: 'Interactive Binary Search Tree Visualizer by Team 01 - Pun Solita, Meng Oudom, Khoun Sovansunchhay',
    images: ['/bst_sso.png'],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'),
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
