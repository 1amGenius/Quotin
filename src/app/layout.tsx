import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { BookmarkProvider } from '@/context/BookmarkContext'
import { ColorsProvider } from '@/context/ColorsContext'
import { ShortcutsProvider } from '@/context/ShortcutsContext'
import TodoNotes from '@/components/TodoNotes'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Quotin - Stylish start page',
    description:
        'Quotin is a new start page that helps you get started with your day. Collect your favorite quotes, images, and links in one place. And add shortcuts to your favorite websites for easy access.',
    icons: {
        icon: [
            { url: '/PcFavicon.png', sizes: '32x32', type: 'image/png' },
            { url: '/PcFavicon.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon.ico', sizes: 'any' }
        ],
        apple: [
            { url: '/AppleFavicon.png', sizes: '180x180', type: 'image/png' }
        ],
        shortcut: '/AppleFavicon.png',
        other: [
            { rel: 'apple-touch-icon-precomposed', url: '/AppleFavicon.png' },
            {
                rel: 'mask-icon',
                url: '/safari-pinned-tab.svg',
                color: '#000000'
            }
        ]
    },
    manifest: '/site.webmanifest'
}

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <html lang='en'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ColorsProvider>
                    <BookmarkProvider>
                        <ShortcutsProvider>{children}</ShortcutsProvider>
                    </BookmarkProvider>
                </ColorsProvider>
                <TodoNotes />
                <Toaster />
            </body>
        </html>
    )
}
