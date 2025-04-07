'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { SiDuckduckgo } from 'react-icons/si'
import { BsBing } from 'react-icons/bs'
import { useColors } from '@/context/ColorsContext'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

// Define the storage key for search engine preference
const STORAGE_KEY = 'preferred_search_engine'

// Define search engines
const searchEngines = [
	{
		name: 'Google',
		url: 'https://www.google.com/search?q=',
		icon: <FaGoogle className='mr-2 text-white/80' />,
	},
	{
		name: 'Bing',
		url: 'https://www.bing.com/search?q=',
		icon: <BsBing className='mr-2 text-blue-500' />,
	},
	{
		name: 'DuckDuckGo',
		url: 'https://duckduckgo.com/?q=',
		icon: <SiDuckduckgo className='mr-2 text-orange-400' />,
	},
]

const SearchBox = () => {
	const [query, setQuery] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [isDesktop, setIsDesktop] = useState(true)
	const [isMedium, setIsMedium] = useState(false)
	const [selectedEngine, setSelectedEngine] = useState(searchEngines[0])
	const { currentColor } = useColors()
	const suggestionRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth
			setIsDesktop(width >= 1024)
			setIsMedium(width >= 768 && width < 1024)
		}

		// Initialize on mount
		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// Load preferred search engine from localStorage on initial render
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedEngine = localStorage.getItem(STORAGE_KEY)
			if (savedEngine) {
				const engine = searchEngines.find(e => e.name === savedEngine)
				if (engine) {
					setSelectedEngine(engine)
				}
			}

			// Listen for storage changes from other components (like welcome flow)
			const handleStorageChange = (e: StorageEvent) => {
				if (e.key === STORAGE_KEY && e.newValue) {
					const engine = searchEngines.find(
						eng => eng.name === e.newValue
					)
					if (engine) {
						setSelectedEngine(engine)
					}
				}
			}

			// Listen for custom event for same-tab updates
			const handleEngineChangeEvent = (e: CustomEvent) => {
				const engineName = e.detail.engine
				const engine = searchEngines.find(
					eng => eng.name === engineName
				)
				if (engine) {
					setSelectedEngine(engine)
				}
			}

			// Add event listeners
			window.addEventListener('storage', handleStorageChange)
			window.addEventListener(
				'search-engine-changed',
				handleEngineChangeEvent as EventListener
			)

			return () => {
				window.removeEventListener('storage', handleStorageChange)
				window.removeEventListener(
					'search-engine-changed',
					handleEngineChangeEvent as EventListener
				)
			}
		}
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

	// Reset selected index when suggestions change
	useEffect(() => {
		setSelectedIndex(0)
	}, [suggestions])

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showSuggestions || suggestions.length === 0) return

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setSelectedIndex(prev =>
					prev < suggestions.length - 1 ? prev + 1 : prev
				)
				break
			case 'ArrowUp':
				e.preventDefault()
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
				break
			case 'Tab':
				e.preventDefault()
				if (e.shiftKey) {
					setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
				} else {
					setSelectedIndex(prev =>
						prev < suggestions.length - 1 ? prev + 1 : prev
					)
				}
				break
			case 'Enter':
				e.preventDefault()
				if (showSuggestions && suggestions[selectedIndex]) {
					handleSuggestionClick(suggestions[selectedIndex])
				} else {
					handleSearch(e)
				}
				break
			case 'Escape':
				setShowSuggestions(false)
				break
		}
	}

	// Add keyboard shortcut for focusing the search box
	useEffect(() => {
		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+K or Command+K
			if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
				event.preventDefault() // Prevent default browser behavior
				inputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleGlobalKeyDown)
		return () => {
			document.removeEventListener('keydown', handleGlobalKeyDown)
		}
	}, [])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (query.trim()) {
			window.open(
				`${selectedEngine.url}${encodeURIComponent(query)}`,
				'_blank'
			)
		}
	}

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion)
		setShowSuggestions(false)
		window.open(
			`${selectedEngine.url}${encodeURIComponent(suggestion)}`,
			'_blank'
		)
	}

	const handleEngineChange = (value: string) => {
		const engine = searchEngines.find(e => e.name === value)
		if (engine) {
			setSelectedEngine(engine)
			localStorage.setItem(STORAGE_KEY, value)
		}
	}

	return (
		<div className='w-full max-w-md mx-auto md:ml-18 lg:mx-auto md:mb-7 lg:mb-16 '>
			<form
				onSubmit={handleSearch}
				className={`w-full transition-all duration-300 ${
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
							onKeyDown={handleKeyDown}
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

					{/* Keyboard shortcuts - positioned at bottom left */}
					<div className='absolute bottom-0 left-0 translate-y-full pt-2 hidden sm:block'>
						<p className='text-xs text-left text-white/50 max-w-[260px] break-words'>
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
							) : isMedium ? (
								'Tablet mode: all features, best experience on desktop'
							) : (
								'Mobile mode: no shortcuts'
							)}
						</p>
					</div>

					{/* Search engine selector - positioned at bottom right */}
					<div className='absolute bottom-0 right-0 translate-y-full pt-2 w-full sm:w-auto flex justify-center sm:justify-end'>
						<Select
							value={selectedEngine.name}
							onValueChange={handleEngineChange}
						>
							<SelectTrigger className='w-40 sm:w-auto border-0 bg-black/50 backdrop-blur-md shadow-lg text-white/80 hover:text-white/80 text-xs'>
								<SelectValue>
									<div className='flex items-center gap-1.5'>
										{selectedEngine.icon}
										<span>{selectedEngine.name}</span>
									</div>
								</SelectValue>
							</SelectTrigger>
							<SelectContent className='bg-black/80 backdrop-blur-3xl border-white/10'>
								{searchEngines.map(engine => (
									<SelectItem
										key={engine.name}
										value={engine.name}
										className='text-white hover:bg-white/10 hover:text-white data-[highlighted]:bg-white/10 data-[highlighted]:text-white'
									>
										<div className='flex items-center'>
											{engine.icon}
											{engine.name}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Suggestions dropdown */}
					{showSuggestions && suggestions.length > 0 && (
						<div className='fixed sm:absolute w-[calc(100vw-2rem)] sm:w-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 top-16 sm:top-auto sm:mt-2 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-lg z-[60]'>
							{suggestions.map((suggestion, index) => (
								<button
									key={index}
									type='button'
									className={`w-full px-4 py-2 text-white hover:bg-white/10 cursor-pointer transition-colors duration-200 flex items-center text-left ${
										index === selectedIndex
											? 'bg-white/10'
											: ''
									}`}
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
			</form>
		</div>
	)
}

export default SearchBox
