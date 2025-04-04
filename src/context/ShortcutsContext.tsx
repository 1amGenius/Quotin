'use client'

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import { Shortcut, shortcutStorage } from '@/lib/shortcutStorage'

type ShortcutsContextType = {
	shortcuts: Shortcut[]
	addShortcut: (name: string, url: string) => Shortcut
	updateShortcut: (id: string, updates: Partial<Omit<Shortcut, 'id'>>) => void
	removeShortcut: (id: string) => void
	clearShortcuts: () => void
	maxShortcuts: number
}

const ShortcutsContext = createContext<ShortcutsContextType | null>(null)

export function ShortcutsProvider({ children }: { children: ReactNode }) {
	const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
	const [maxShortcuts, setMaxShortcuts] = useState(20) // Default to desktop

	// Initial load of shortcuts from localStorage
	useEffect(() => {
		setShortcuts(shortcutStorage.getShortcuts())
	}, [])

	// Set max shortcuts based on screen size
	useEffect(() => {
		const handleResize = () => {
			setMaxShortcuts(window.innerWidth >= 768 ? 20 : 3)
		}

		// Set initial value
		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	const addShortcut = (name: string, url: string) => {
		const newShortcut = shortcutStorage.saveShortcut({ name, url })
		setShortcuts(prev => [...prev, newShortcut])
		return newShortcut
	}

	const updateShortcut = (
		id: string,
		updates: Partial<Omit<Shortcut, 'id'>>
	) => {
		const updated = shortcutStorage.updateShortcut(id, updates)
		if (updated) {
			setShortcuts(prev =>
				prev.map(shortcut => (shortcut.id === id ? updated : shortcut))
			)
		}
	}

	const removeShortcut = (id: string) => {
		shortcutStorage.removeShortcut(id)
		setShortcuts(prev => prev.filter(shortcut => shortcut.id !== id))
	}

	const clearShortcuts = () => {
		shortcutStorage.clearShortcuts()
		setShortcuts([])
	}

	const value = {
		shortcuts,
		addShortcut,
		updateShortcut,
		removeShortcut,
		clearShortcuts,
		maxShortcuts,
	}

	return (
		<ShortcutsContext.Provider value={value}>
			{children}
		</ShortcutsContext.Provider>
	)
}

export function useShortcuts() {
	const context = useContext(ShortcutsContext)
	if (!context) {
		throw new Error('useShortcuts must be used within a ShortcutsProvider')
	}
	return context
}
