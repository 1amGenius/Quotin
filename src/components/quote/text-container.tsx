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

	useEffect(() => {
		if (quote) {
			setShowQuotes(true)

			const typingTimer = setTimeout(() => {
				setStartTyping(true)
			}, 500)

			return () => clearTimeout(typingTimer)
		}
	}, [quote])

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

	return (
		<div className='relative z-20 flex flex-col items-center justify-center'>
			<div className='group z-30 bg-black/10 p-6 rounded-2xl backdrop-blur-[100px] border border-white/10 shadow-sm shadow-white/10 relative min-w-[85vw] md:min-w-[800px] max-w-[85vw] md:max-w-[800px] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none'>
				<ActionButtons
					onRefresh={handleRefresh}
					quoteToCopy={`${quote.text} -${quote.name}`}
				/>
				<AnimatedQuote show={showQuotes} position='left' />
				<div className='min-h-[100px] md:min-h-[120px]'>
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
