import { Bookmark } from '@/types/bookmark'

const STORAGE_KEY = 'quotin_bookmarks'

export const storage = {
    getBookmarks: (): Bookmark[] => {
        if (typeof window === 'undefined') return []
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    },

    saveBookmark: (bookmark: Bookmark): void => {
        const bookmarks = storage.getBookmarks()
        // Check if quote already exists
        if (!bookmarks.some(b => b.quote === bookmark.quote)) {
        bookmarks.push(bookmark)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
        }
    },

    removeBookmark: (id: string): void => {
        const bookmarks = storage.getBookmarks()
        const filtered = bookmarks.filter(b => b.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    clearBookmarks: (): void => {
        localStorage.removeItem(STORAGE_KEY)
    }
} 