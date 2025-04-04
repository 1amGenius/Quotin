'use client'

import { useState, useEffect } from 'react'
import { X, Clock, Sun, Moon } from 'lucide-react'
import { Russo_One } from 'next/font/google'

// Load Russo One font - a bold, futuristic font perfect for digital displays
const russoOne = Russo_One({
	weight: '400', // Only available in 400 weight
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-russo-one',
})

// Storage key for calendar preference
const CALENDAR_PREFERENCE_KEY = 'clock-calendar-preference'

// Persian/Solar month names
const solarMonths = [
	'Farvardin',
	'Ordibehesht',
	'Khordad',
	'Tir',
	'Mordad',
	'Shahrivar',
	'Mehr',
	'Aban',
	'Azar',
	'Dey',
	'Bahman',
	'Esfand',
]

// Convert date to Persian/Solar date
const toSolarDate = (date: Date) => {
	// Get Persian date from Gregorian date
	// This is a simplified implementation
	// Different offset from Gregorian calendar (approx. 621 years)
	// Exact algorithmic conversion would be more complex

	const gregorianYear = date.getFullYear()
	const gregorianMonth = date.getMonth()
	const gregorianDay = date.getDate()

	// Rough estimation for demonstrative purposes
	const solarYear = gregorianYear - 621
	const solarMonth = gregorianMonth
	let solarDay = gregorianDay

	// Simple day adjustment for demo purposes
	if (solarDay > 31) solarDay = 31

	const weekday = date.toLocaleDateString('en-US', { weekday: 'short' })
	return `${weekday}, ${solarMonths[solarMonth]} ${solarDay}, ${solarYear}`
}

const ClockDisplay = () => {
	const [time, setTime] = useState<string>('')
	const [date, setDate] = useState<string>('')
	const [solarDate, setSolarDate] = useState<string>('')
	const [expanded, setExpanded] = useState(false)
	const [isDesktop, setIsDesktop] = useState(true)
	// Initialize with preference from localStorage, default to false (AD/Gregorian)
	const [useSolar, setUseSolar] = useState<boolean>(() => {
		if (typeof window !== 'undefined') {
			const savedPreference = localStorage.getItem(
				CALENDAR_PREFERENCE_KEY
			)
			return savedPreference === 'solar'
		}
		return false
	})

	// Save preference to localStorage when it changes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(
				CALENDAR_PREFERENCE_KEY,
				useSolar ? 'solar' : 'gregorian'
			)
		}
	}, [useSolar])

	// Update time and date every second
	useEffect(() => {
		const updateTimeAndDate = () => {
			const now = new Date()

			// Format time: HH:MM:SS
			const hours = now.getHours().toString().padStart(2, '0')
			const minutes = now.getMinutes().toString().padStart(2, '0')
			const seconds = now.getSeconds().toString().padStart(2, '0')
			setTime(`${hours}:${minutes}:${seconds}`)

			// Format standard date: DAY, MONTH DD, YYYY
			const options: Intl.DateTimeFormatOptions = {
				weekday: 'short',
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}
			setDate(now.toLocaleDateString('en-US', options))

			// Format solar date
			setSolarDate(toSolarDate(now))
		}

		// Initial update
		updateTimeAndDate()

		// Set up interval to update every second
		const interval = setInterval(updateTimeAndDate, 1000)

		// Cleanup on unmount
		return () => clearInterval(interval)
	}, [])

	// Check if we're on desktop
	useEffect(() => {
		const checkDesktop = () => {
			setIsDesktop(window.innerWidth >= 768)
		}

		// Initial check
		checkDesktop()

		// Check on resize
		window.addEventListener('resize', checkDesktop)
		return () => window.removeEventListener('resize', checkDesktop)
	}, [])

	// Add keyboard shortcut for Escape key
	useEffect(() => {
		if (!expanded) return

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setExpanded(false)
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [expanded])

	// If not desktop, don't render anything
	if (!isDesktop) return null

	return (
		<>
			{/* Overlay */}
			{expanded && (
				<div
					className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]  transition-opacity duration-300 animate-in fade-in'
					onClick={() => setExpanded(false)}
				/>
			)}

			{/* Clock */}
			<div
				className={`
                    fixed flex items-center justify-center transition-all duration-500 cursor-pointer z-[100]
                    ${
						expanded
							? 'w-[20vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shadow-lg'
							: 'top-4 left-4 p-3 rounded-lg bg-black/20 hover:bg-black/40 active:bg-black/60 hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/10 shadow-md hover:shadow-white/5'
					}
                `}
				onClick={() => !expanded && setExpanded(true)}
				style={{ pointerEvents: 'auto' }}
			>
				<div className='relative flex flex-col items-center gap-1'>
					{!expanded && (
						<Clock className='h-5 w-5 text-white/80 mb-1' />
					)}
					<div className='flex flex-col items-center gap-1'>
						<h2
							className={`text-white ${russoOne.className} ${
								expanded ? 'text-6xl' : 'text-lg'
							} tracking-wide`}
						>
							{time}
						</h2>
						<div
							className={`text-white/70 ${russoOne.className} ${
								expanded ? 'text-2xl' : 'text-xs'
							} tracking-wide`}
						>
							{useSolar ? solarDate : date}
						</div>

						{expanded && (
							<button
								onClick={e => {
									e.stopPropagation()
									setUseSolar(!useSolar)
								}}
								className='mt-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-all duration-300 px-3 py-1.5 rounded-full'
							>
								{useSolar ? (
									<>
										<Moon className='h-4 w-4 text-yellow-300' />
										<span
											className={`text-white/90 ${russoOne.className} text-sm`}
										>
											Show Gregorian
										</span>
									</>
								) : (
									<>
										<Sun className='h-4 w-4 text-yellow-300' />
										<span
											className={`text-white/90 ${russoOne.className} text-sm`}
										>
											Show Solar
										</span>
									</>
								)}
							</button>
						)}
					</div>

					{expanded && (
						<button
							onClick={e => {
								e.stopPropagation()
								setExpanded(false)
							}}
							className='absolute -top-8 -right-8 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200'
						>
							<X className='h-5 w-5 text-white' />
						</button>
					)}

					{expanded && (
						<p
							className={`text-white/50 text-sm mt-4 text-center ${russoOne.className}`}
						>
							Press{' '}
							<kbd className='bg-white/10 px-1 rounded'>Esc</kbd>{' '}
							to close
						</p>
					)}
				</div>
			</div>
		</>
	)
}

export default ClockDisplay
