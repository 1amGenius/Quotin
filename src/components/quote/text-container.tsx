'use client'
import { useState, useEffect } from 'react'
import Typewriter from './typewriter'
import AnimatedSignature from './animated-signature'
import AnimatedQuote from './animated-quote'
import ActionButtons from './action-buttons'
import SkeletonContainer from './skeleton-container'
import { getRandomQuote } from '@/actions/quote/get-random'

interface Quote {
	text: string
	name: string
}

export default function TextContainer() {
	const [showQuotes, setShowQuotes] = useState(false)
	const [startTyping, setStartTyping] = useState(false)
	const [showSignature, setShowSignature] = useState(false)
	const [quote, setQuote] = useState<Quote | null>(null)
	const [isLoading, setIsLoading] = useState(true) // Track loading state

	useEffect(() => {
		const fetchQuote = async () => {
			setIsLoading(true) // Set loading state to true
			const fetchedQuote = await getRandomQuote()
			setQuote(fetchedQuote)
			setIsLoading(false) // Set loading state to false
		}

		fetchQuote()
		setShowQuotes(true)

		const typingTimer = setTimeout(() => {
			setStartTyping(true)
		}, 500)

		return () => clearTimeout(typingTimer)
	}, [])

	const handleRefresh = async () => {
		setIsLoading(true) // Show loading state during refresh
		const newQuote = await getRandomQuote()
		setQuote(newQuote)
		setIsLoading(false) // Set loading state to false

		// Reset animation states
		setShowQuotes(false)
		setStartTyping(false)
		setShowSignature(false)
		// Restart animations
		setShowQuotes(true)
		setTimeout(() => setStartTyping(true), 500)
	}

	// Show skeleton while loading
	if (isLoading) {
		return <SkeletonContainer />
	}

	// Render main content when loading is complete
	return (
		<div className='relative z-20 flex flex-col items-center justify-center min-h-screen p-5'>
			<div className='group z-30 bg-black/10 p-8 rounded-2xl backdrop-blur-[100px] border border-white/10 shadow-sm shadow-white/10 relative min-w-[90vw] md:min-w-[900px] max-w-[90vw] md:max-w-[900px] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none'>
				<ActionButtons
					onRefresh={handleRefresh}
					quoteToCopy={quote ? `${quote.text} -${quote.name}` : ''}
				/>
				<AnimatedQuote show={showQuotes} position='left' />
				<div className='min-h-[120px] md:min-h-[150px]'>
					{startTyping && quote && (
						<Typewriter
							text={quote.text}
							className='mt-3 pl-5 pb-5 text-2xl sm:text-3xl md:text-4xl border-l border-b border-r border-white/10 font-bold text-white'
							onComplete={() => setShowSignature(true)}
						/>
					)}
				</div>
				<AnimatedQuote show={showQuotes} position='right' />
				{quote && (
					<AnimatedSignature show={showSignature} name={quote.name} />
				)}
			</div>
		</div>
	)
}
