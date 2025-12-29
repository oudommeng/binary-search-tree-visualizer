import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { generateEducationalSchema, generateBreadcrumbSchema } from '@/lib/schema'
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
  keywords: ['Binary Search Tree', 'BST', 'Visualizer', 'CADT', 'Data Structures', 'Algorithm', 'Tree Visualization', 'Computer Science', 'Education', 'Interactive Learning'],
  category: 'Education',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-site-verification-code', // Add after Google Search Console setup
  },
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'Binary Search Tree Visualization - Developed By SSO',
    description: 'Explore and visualize Binary Search Trees interactively. Developed by Team SSO (Pun Solita, Meng Oudom, Khoun Sovansunchhay) - Team 01 MCS02 CADT. Perfect for learning data structures.',
    siteName: 'BST Visualizer by Team SSO',
    url: 'https://bst.oudommeng.me',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/bst_sso.png',
        width: 1200,
        height: 630,
        type: 'image/png',
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
  const educationalSchema = generateEducationalSchema()
  const breadcrumbSchema = generateBreadcrumbSchema()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationalSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
