'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useColors } from '@/context/ColorsContext'

const SearchBox = () => {
	const [query, setQuery] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [isDesktop, setIsDesktop] = useState(true)
	const { currentColor } = useColors()
	const suggestionRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	// Check if window exists and set device type
	useEffect(() => {
		setIsDesktop(window.innerWidth >= 1024)

		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024)
		}

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	useEffect(() => {
		// Function to fetch suggestions
		const fetchSuggestions = async () => {
			if (query.trim().length < 2) {
				setSuggestions([])
				return
			}

			try {
				const mockSuggestions = [
					`${query} results`,
					`${query} online`,
					`${query} meaning`,
					`${query} definition`,
					`${query} examples`,
				]
				setSuggestions(mockSuggestions)
			} catch (error) {
				console.error('Error fetching suggestions:', error)
				setSuggestions([])
			}
		}

		const timeoutId = setTimeout(() => {
			fetchSuggestions()
		}, 300)

		return () => clearTimeout(timeoutId)
	}, [query])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				suggestionRef.current &&
				!suggestionRef.current.contains(event.target as Node)
			) {
				setShowSuggestions(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	// Add keyboard shortcut for focusing the search box
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+K or Command+K
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault() // Prevent default browser behavior
				inputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim()) {
			window.open(
				`https://www.google.com/search?q=${encodeURIComponent(query)}`,
				'_blank'
			)
		}
	}

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion)
		setShowSuggestions(false)
		window.open(
			`https://www.google.com/search?q=${encodeURIComponent(suggestion)}`,
			'_blank'
		)
	}

	return (
		<form
			onSubmit={handleSearch}
			className={`w-full max-w-md mx-auto transition-all duration-300 ${
				isFocused ? 'scale-105' : 'scale-100'
			}`}
		>
			<div className='relative group' ref={suggestionRef}>
				<div
					className={`absolute inset-0 bg-gradient-to-r rounded-xl blur-md opacity-50 group-hover:opacity-70 transition duration-500 ${
						isFocused ? 'opacity-70' : ''
					}`}
					style={{
						background: `linear-gradient(to right, rgba(128, 128, 128, 0.5), rgba(100, 100, 100, 0.5), ${currentColor}70)`,
					}}
				></div>
				<div
					className='relative flex items-center bg-black/50 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg'
					style={{
						boxShadow: isFocused
							? `0 0 15px 1px ${currentColor}30`
							: 'none',
					}}
				>
					<input
						ref={inputRef}
						type='text'
						value={query}
						onChange={e => setQuery(e.target.value)}
						onFocus={() => {
							setIsFocused(true)
							setShowSuggestions(true)
						}}
						onBlur={() => setIsFocused(false)}
						placeholder='Search the web...'
						className='w-full py-3 px-4 bg-transparent text-white placeholder-white/50 focus:outline-none'
					/>
					<button
						type='submit'
						className='flex items-center justify-center h-full px-4 text-white'
					>
						<Search
							className='w-5 h-5'
							style={{ color: `${currentColor}` }}
						/>
					</button>
				</div>

				{/* Suggestions dropdown */}
				{showSuggestions && suggestions.length > 0 && (
					<div className='absolute w-full mt-2 bg-black/50 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-lg z-40'>
						{suggestions.map((suggestion, index) => (
							<button
								key={index}
								type='button'
								className='w-full px-4 py-2 text-white hover:bg-white/10 cursor-pointer transition-colors duration-200 flex items-center text-left'
								onClick={e => {
									e.preventDefault()
									e.stopPropagation()
									handleSuggestionClick(suggestion)
								}}
							>
								<Search className='w-4 h-4 mr-2 opacity-50' />
								{suggestion}
							</button>
						))}
					</div>
				)}
			</div>
			<p className='text-xs text-center mt-2 text-white/50'>
				{isDesktop ? (
					<>
						Press{' '}
						{navigator.userAgent.includes('Win') ? (
							<span className='bg-white/10 px-1 rounded'>
								<kbd>Ctrl</kbd> + <kbd>K</kbd>
							</span>
						) : (
							<span className='bg-white/10 px-1 rounded'>
								<kbd>⌘</kbd> + <kbd>K</kbd>
							</span>
						)}{' '}
						to search • Enter to submit
					</>
				) : (
					'In order to use all of the features, please use a desktop computer'
				)}
			</p>
		</form>
	)
}

export default SearchBox
