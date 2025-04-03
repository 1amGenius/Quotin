const COLORS_STORAGE_KEY = 'quotin_colors'

export const getStoredColors = (): string[] => {
    if (typeof window === 'undefined') return []
    const stored = localStorage.getItem(COLORS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
}

export const setStoredColors = (colors: string[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(colors))
} 