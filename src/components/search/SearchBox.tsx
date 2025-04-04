'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { useColors } from '@/context/ColorsContext'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { SiGoogle, SiDuckduckgo } from 'react-icons/si'
import { FaMicrosoft } from 'react-icons/fa'
import Link from 'next/link'

// Define search engine types and URLs
type SearchEngine = 'google' | 'bing' | 'duckduckgo'

interface SearchEngineInfo {
	name: string
	url: string
	icon: React.ReactNode
	color: string
}

const searchEngines: Record<SearchEngine, SearchEngineInfo> = {
	google: {
		name: 'Google',
		url: 'https://www.google.com/search?q=',
		icon: <SiGoogle />,
		color: '#4285F4',
	},
	bing: {
		name: 'Bing',
		url: 'https://www.bing.com/search?q=',
		icon: <FaMicrosoft />,
		color: '#008373',
	},
	duckduckgo: {
		name: 'DuckDuckGo',
		url: 'https://duckduckgo.com/?q=',
		icon: <SiDuckduckgo />,
		color: '#DE5833',
	},
}

const SEARCH_ENGINE_KEY = 'preferred-search-engine'

const SearchBox = () => {
	const [query, setQuery] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [isDesktop, setIsDesktop] = useState(true)
	const [searchEngine, setSearchEngine] = useState<SearchEngine>(() => {
		if (typeof window !== 'undefined') {
			const savedEngine = localStorage.getItem(
				SEARCH_ENGINE_KEY
			) as SearchEngine | null
			if (
				savedEngine &&
				Object.keys(searchEngines).includes(savedEngine)
			) {
				return savedEngine
			}
		}
		return 'google'
	})
	const { currentColor } = useColors()
	const suggestionRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)

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
			const engineUrl = searchEngines[searchEngine].url
			window.open(`${engineUrl}${encodeURIComponent(query)}`, '_blank')
		}
	}

	const handleSuggestionClick = (suggestion: string) => {
		setQuery(suggestion)
		setShowSuggestions(false)
		const engineUrl = searchEngines[searchEngine].url
		window.open(`${engineUrl}${encodeURIComponent(suggestion)}`, '_blank')
	}

	const handleEngineChange = (value: string) => {
		setSearchEngine(value as SearchEngine)
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(SEARCH_ENGINE_KEY, searchEngine)
			console.log('Saved engine to localStorage:', searchEngine)
		}
	}, [searchEngine])

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
					<div className='flex-shrink-0 pl-2'>
						<Select
							value={searchEngine}
							onValueChange={handleEngineChange}
						>
							<SelectTrigger className='border-0 bg-transparent text-white h-12 w-12 p-0 shadow-none focus:ring-0 hover:bg-white/10 transition-all duration-200 rounded-full'>
								<SelectValue>
									<div
										className='flex items-center justify-center w-10 h-10 overflow-hidden rounded-full transition-all duration-200'
										style={{
											color: searchEngines[searchEngine]
												.color,
										}}
									>
										<span className='text-2xl'>
											{searchEngines[searchEngine].icon}
										</span>
									</div>
								</SelectValue>
							</SelectTrigger>
							<SelectContent className='bg-black/80 border-white/10 text-white backdrop-blur-md'>
								{Object.entries(searchEngines).map(
									([key, engine]) => (
										<SelectItem
											key={key}
											value={key}
											className='text-white hover:bg-white/10 focus:bg-white/10 data-[highlighted]:text-white data-[highlighted]:bg-white/10 transition-colors duration-200'
										>
											<div className='flex items-center gap-3 px-1'>
												<div
													className='flex-shrink-0 w-8 h-8 flex items-center justify-center transition-transform duration-200 rounded-full p-1.5'
													style={{
														color: engine.color,
														background: `${engine.color}10`,
													}}
												>
													<span className='text-xl'>
														{engine.icon}
													</span>
												</div>
												<span className='text-white'>
													{engine.name}
												</span>
											</div>
										</SelectItem>
									)
								)}
							</SelectContent>
						</Select>
					</div>
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
						className='w-full py-3 px-2 bg-transparent text-white placeholder-white/50 focus:outline-none'
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
			<div className='flex items-center justify-between mt-2'>
				<p className='text-xs text-white/50'>
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
							to search
						</>
					) : (
						'Use desktop for all features'
					)}
				</p>
				<p className='text-xs text-white/50 flex items-center gap-1'>
					Using
					<span
						className='inline-flex items-center justify-center w-4 h-4 mx-1'
						style={{ color: searchEngines[searchEngine].color }}
					>
						{searchEngines[searchEngine].icon}
					</span>
					<Link
						href={searchEngines[searchEngine].url}
						className='text-white hover:text-white/50 transition-colors duration-200 underline hover:no-underline'
					>
						{searchEngines[searchEngine].name}
					</Link>
				</p>
			</div>
		</form>
	)
}

export default SearchBox
