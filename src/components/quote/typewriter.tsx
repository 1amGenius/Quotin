'use client'
import { useEffect, useState } from 'react'

interface TypewriterProps {
	text: string
	className?: string
	onComplete?: () => void
}

export default function Typewriter({
	text,
	className = '',
	onComplete,
}: TypewriterProps) {
	const [displayText, setDisplayText] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(() => {
				setDisplayText(prev => prev + text[currentIndex])
				setCurrentIndex(prev => prev + 1)
			}, 30) // Adjust speed here (lower number = faster)

			return () => clearTimeout(timeout)
		} else if (onComplete) {
			onComplete()
		}
	}, [currentIndex, text, onComplete])

	return <h1 className={className}>{displayText}</h1>
}
