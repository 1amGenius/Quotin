'use client'
import { useState, useEffect } from 'react'
import Typewriter from './typewriter'
import AnimatedSignature from './animated-signature'
import AnimatedQuote from './animated-quote'
import ActionButtons from './action-buttons'

interface Quote {
	text: string
	name: string
}

interface TextContainerProps {
	quote: Quote | null
	onRefresh: () => Promise<void>
}

export default function TextContainer({
	quote,
	onRefresh,
}: TextContainerProps) {
	const [showQuotes, setShowQuotes] = useState(false)
	const [startTyping, setStartTyping] = useState(false)
	const [showSignature, setShowSignature] = useState(false)

	// Reset animations whenever the quote changes
	useEffect(() => {
		if (quote) {
			// Start the animation sequence
			setShowQuotes(false)
			setStartTyping(false)
			setShowSignature(false)

			// Short delay to ensure animations reset
			setTimeout(() => {
				setShowQuotes(true)
				setTimeout(() => setStartTyping(true), 500)
			}, 50)
		}
	}, [quote]) // This dependency ensures we respond to every quote change

	const handleRefresh = async () => {
		// Reset animation states
		setShowQuotes(false)
		setStartTyping(false)
		setShowSignature(false)

		// Fetch new quote
		await onRefresh()

		// Restart animations
		setShowQuotes(true)
		setTimeout(() => setStartTyping(true), 500)
	}

	// If quote is null or undefined, don't render anything
	if (!quote) {
		return null
	}

	// Create the quote string to copy with the actual current quote
	const quoteToCopy = `${quote.text} -${quote.name}`

	return (
		<div className='relative z-0 flex flex-col items-center justify-center'>
			<div className='group z-0 bg-black/10 p-6 rounded-2xl backdrop-blur-[100px] border border-white/10 shadow-sm shadow-white/10 relative min-w-[85vw] md:min-w-[800px] max-w-[85vw] md:max-w-[800px] mb-7 md:mb-0 lg:mb-0 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none'>
				<ActionButtons
					onRefresh={handleRefresh}
					quoteToCopy={quoteToCopy}
				/>
				<AnimatedQuote show={showQuotes} position='left' />
				<div className='min-h-[100px] md:min-h-[120px] max-h-[35vh] sm:max-h-none overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent sm:overflow-visible'>
					{startTyping && quote && (
						<Typewriter
							text={quote.text}
							className='mt-3 pl-4 pb-4 text-xl sm:text-2xl md:text-3xl border-l border-b border-r border-white/10 font-bold text-white'
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
