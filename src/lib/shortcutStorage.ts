import { v4 as uuidv4 } from 'uuid'

export interface Shortcut {
    id: string
    name: string
    url: string
    favicon?: string
}

const STORAGE_KEY = 'quotin_shortcuts'

export const shortcutStorage = {
    getShortcuts: (): Shortcut[] => {
        if (typeof window === 'undefined') return []
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    },

    saveShortcut: (shortcut: Omit<Shortcut, 'id' | 'favicon'>): Shortcut => {
        const shortcuts = shortcutStorage.getShortcuts()
        
        // Create new shortcut with ID
        const newShortcut: Shortcut = {
            id: uuidv4(),
            name: shortcut.name,
            url: shortcut.url,
            favicon: getFaviconUrl(shortcut.url)
        }
        
        // Add to shortcuts array
        shortcuts.push(newShortcut)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts))
        
        return newShortcut
    },

    updateShortcut: (id: string, updates: Partial<Omit<Shortcut, 'id'>>): Shortcut | null => {
        const shortcuts = shortcutStorage.getShortcuts()
        const index = shortcuts.findIndex(s => s.id === id)
        
        if (index === -1) return null
        
        // Update shortcut
        const updatedShortcut = {
            ...shortcuts[index],
            ...updates,
            // Update favicon if URL changed
            favicon: updates.url ? getFaviconUrl(updates.url) : shortcuts[index].favicon
        }
        
        shortcuts[index] = updatedShortcut
        localStorage.setItem(STORAGE_KEY, JSON.stringify(shortcuts))
        
        return updatedShortcut
    },

    removeShortcut: (id: string): void => {
        const shortcuts = shortcutStorage.getShortcuts()
        const filtered = shortcuts.filter(s => s.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    },

    clearShortcuts: (): void => {
        localStorage.removeItem(STORAGE_KEY)
    }
}

// Helper function to get favicon URL
function getFaviconUrl(url: string): string {
    try {
        const urlObj = new URL(url)
        return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
    } catch (error) {
        // Log error and provide a fallback
        console.error('Invalid URL:', url, error)
        return ''
    }
} 