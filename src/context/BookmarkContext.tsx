'use client'
import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { Bookmark } from '@/types/bookmark'
import { storage } from '@/lib/storage'

interface BookmarkContextType {
	bookmarks: Bookmark[]
	addBookmark: (quote: string, author: string) => void
	removeBookmark: (id: string) => void
	isBookmarked: (quote: string) => boolean
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
	undefined
)

function generateUUID(): string {
	// This is a simple UUID v4 implementation
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
		/[xy]/g,
		function (c) {
			const r = (Math.random() * 16) | 0
			const v = c === 'x' ? r : (r & 0x3) | 0x8
			return v.toString(16)
		}
	)
}

export function BookmarkProvider({ children }: { children: ReactNode }) {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

	useEffect(() => {
		setBookmarks(storage.getBookmarks())
	}, [])

	const addBookmark = (quote: string, author: string) => {
		const newBookmark: Bookmark = {
			id: generateUUID(), // Using our custom UUID generator instead of crypto.randomUUID()
			quote,
			author,
			createdAt: Date.now(),
		}
		storage.saveBookmark(newBookmark)
		setBookmarks(storage.getBookmarks())
	}

	const removeBookmark = (id: string) => {
		storage.removeBookmark(id)
		setBookmarks(storage.getBookmarks())
	}

	const isBookmarked = (quote: string) => {
		return bookmarks.some(bookmark => bookmark.quote === quote)
	}

	return (
		<BookmarkContext.Provider
			value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}
		>
			{children}
		</BookmarkContext.Provider>
	)
}

export function useBookmarks() {
	const context = useContext(BookmarkContext)
	if (context === undefined) {
		throw new Error('useBookmarks must be used within a BookmarkProvider')
	}
	return context
}
