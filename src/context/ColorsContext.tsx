'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const COLORS_STORAGE_KEY = 'quotin_colors'

interface ColorsContextType {
	colors: string[]
	currentColor: string | null
	setColors: (colors: string[]) => void
	addColor: (color: string) => void
	removeColor: (color: string) => void
}

const ColorsContext = createContext<ColorsContextType | undefined>(undefined)

export function ColorsProvider({ children }: { children: React.ReactNode }) {
	const [colors, setColors] = useState<string[]>([])
	const [currentColor, setCurrentColor] = useState<string | null>(null)

	// Load colors from storage and set a random color on mount
	useEffect(() => {
		const stored = localStorage.getItem(COLORS_STORAGE_KEY)
		const storedColors = stored ? JSON.parse(stored) : []
		setColors(storedColors)

		if (storedColors.length > 0) {
			const randomColor =
				storedColors[Math.floor(Math.random() * storedColors.length)]
			setCurrentColor(randomColor)
		} else {
			setCurrentColor('#1a1a1a') // Default dark gray
		}
	}, [])

	const handleSetColors = (newColors: string[]) => {
		setColors(newColors)
		localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(newColors))

		// Update current color if necessary
		if (newColors.length > 0) {
			if (!newColors.includes(currentColor!)) {
				const randomColor =
					newColors[Math.floor(Math.random() * newColors.length)]
				setCurrentColor(randomColor)
			}
		} else {
			setCurrentColor('#1a1a1a') // Default dark gray when no colors selected
		}
	}

	const addColor = (color: string) => {
		if (!colors.includes(color)) {
			handleSetColors([...colors, color])
		}
	}

	const removeColor = (color: string) => {
		handleSetColors(colors.filter(c => c !== color))
	}

	return (
		<ColorsContext.Provider
			value={{
				colors,
				currentColor,
				setColors: handleSetColors,
				addColor,
				removeColor,
			}}
		>
			{children}
		</ColorsContext.Provider>
	)
}

export const useColors = () => {
	const context = useContext(ColorsContext)
	if (context === undefined) {
		throw new Error('useColors must be used within a ColorsProvider')
	}
	return context
}
