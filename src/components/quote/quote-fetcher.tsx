'use client'

import { useEffect, useState } from 'react'
import TextContainer from './text-container'
import SkeletonContainer from './skeleton-container'
import { getRandomQuote } from '@/actions/quote/get-random'

interface Quote {
	text: string
	name: string
}

export default function QuoteFetcher() {
	const [quote, setQuote] = useState<Quote | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const fetchQuoteWithCategories = async () => {
		setIsLoading(true)
		setQuote(null) // Reset quote while loading

		// Get categories from localStorage
		let categories: string[] = []
		try {
			const savedCategories = localStorage.getItem('selectedCategories')
			if (savedCategories) {
				categories = JSON.parse(savedCategories)
			}
		} catch (error) {
			console.error('Error reading categories from localStorage:', error)
		}

		try {
			// Use the server action for all requests, passing categories if available
			const serverQuote = await getRandomQuote(
				categories.length > 0 ? categories : undefined
			)
			console.log(
				`[${new Date().toLocaleTimeString()}] Set quote:`,
				serverQuote
			)
			setQuote({
				...serverQuote,
			})
		} catch (error) {
			console.error('Error fetching quote:', error)
			// Fallback quote
			setQuote({
				text: 'The best way to predict the future is to invent it.',
				name: 'Alan Kay',
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		// Only fetch on initial mount, not when hasInitialized changes
		fetchQuoteWithCategories()

		// Add event listener for storage changes
		const handleStorageChange = (e: StorageEvent) => {
			// Only refetch if the categories changed
			if (e.key === 'selectedCategories') {
				fetchQuoteWithCategories()
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [])

	const handleRefresh = async () => {
		await fetchQuoteWithCategories()
	}

	// Show skeleton while loading or if quote is null
	if (isLoading || !quote) {
		return <SkeletonContainer />
	}

	return <TextContainer quote={quote} onRefresh={handleRefresh} />
}
