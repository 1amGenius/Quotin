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
    title: 'Quotin',
    description: 'Your personal quote collection and inspiration hub'
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
