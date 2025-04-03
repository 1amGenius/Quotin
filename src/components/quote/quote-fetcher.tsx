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
	const [hasInitialized, setHasInitialized] = useState(false)

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
			// If there are no categories in localStorage, use the server action
			if (categories.length === 0) {
				const serverQuote = await getRandomQuote()
				setQuote({
					...serverQuote,
				})
				setIsLoading(false)
				setHasInitialized(true)
				return
			}

			// If there are categories, use the client-side API call with categories
			const tagsParam = categories.join('|')
			const apiUrl = `https://api.quotable.io/quotes/random?minLength=77&maxLength=170&tags=${tagsParam}`

			const response = await fetch(apiUrl)

			if (!response.ok) {
				throw new Error(
					`API request failed with status: ${response.status}`
				)
			}

			const data = await response.json()

			if (data && data.length > 0) {
				setQuote({
					text: data[0].content,
					name: data[0].author,
				})
			} else {
				throw new Error('No quote returned')
			}
		} catch (error) {
			console.error('Error fetching quote:', error)
			// Fallback quote with a default tag
			setQuote({
				text: 'The best way to predict the future is to invent it.',
				name: 'Alan Kay',
			})
		} finally {
			setIsLoading(false)
			setHasInitialized(true)
		}
	}

	useEffect(() => {
		fetchQuoteWithCategories()

		// Add event listener for storage changes
		const handleStorageChange = () => {
			if (hasInitialized) {
				fetchQuoteWithCategories()
			}
		}

		window.addEventListener('storage', handleStorageChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
		}
	}, [hasInitialized])

	const handleRefresh = async () => {
		await fetchQuoteWithCategories()
	}

	// Show skeleton while loading or if quote is null
	if (isLoading || !quote) {
		return <SkeletonContainer />
	}

	return <TextContainer quote={quote} onRefresh={handleRefresh} />
}
