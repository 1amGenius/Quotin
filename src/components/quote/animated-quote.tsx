'use client'

interface AnimatedQuoteProps {
	show: boolean
	position: 'left' | 'right'
	className?: string
}

export default function AnimatedQuote({
	show,
	position,
	className = '',
}: AnimatedQuoteProps) {
	const baseClasses = `text-4xl sm:text-5xl md:text-6xl text-white/60 transition-all duration-500 transform ${
		show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
	}`

	if (position === 'left') {
		return (
			<span
				className={`absolute -left-0 pl-5 md:mt-2 mt-4 top-0 ${baseClasses} ${className}`}
			>
				&ldquo;
			</span>
		)
	}

	return (
		<span
			className={`absolute -right-0 pr-5 md:mt-2 mt-4 top-0 ${baseClasses} ${className}`}
		>
			&rdquo;
		</span>
	)
}
