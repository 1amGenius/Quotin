import { IoCopyOutline, IoCheckmark } from 'react-icons/io5'
import { Bookmark } from '@/types/bookmark'

interface BookmarkItemProps {
	bookmark: Bookmark
	isCopied: boolean
	onCopy: (quote: string) => void
	onRemove: (id: string) => void
	className?: string
	isMobile?: boolean
}

export function BookmarkItem({
	bookmark,
	isCopied,
	onCopy,
	onRemove,
	className = '',
	isMobile = false,
}: BookmarkItemProps) {
	// Get truncated versions based on screen size
	const getQuoteTruncateLength = () => {
		// Check window width for responsive truncation
		if (typeof window !== 'undefined') {
			const width = window.innerWidth
			if (width < 640) return 40 // Mobile
			if (width < 768) return 50 // Small tablet
			if (width < 1024) return 60 // Medium tablet
			if (width < 1280) return 70 // Small desktop
			return 100 // Large desktop
		}
		return isMobile ? 40 : 80 // Fallback
	}

	// Truncate quote text to prevent overflow
	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	const quoteText = truncateText(bookmark.quote, getQuoteTruncateLength())
	const authorText = truncateText(bookmark.author, isMobile ? 12 : 20)

	return (
		<div
			className={`group/quote relative transition-all duration-300 ${
				isMobile ? 'p-1.5 py-1' : 'hover:bg-white/5 p-2'
			} rounded-lg ${className}`}
		>
			{isMobile ? (
				// Mobile/Medium layout
				<div className='flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1 pr-7'>
					<p className='text-white/80 text-xs sm:text-xs line-clamp-2 sm:line-clamp-1 font-medium w-full sm:max-w-[65%]'>
						&ldquo;{quoteText}&rdquo;
					</p>
					<p className='text-white/60 text-xs italic truncate w-[100px]'>
						-{authorText}
					</p>
					<div className='absolute right-1 top-1/2 -translate-y-1/2 flex gap-1 sm:opacity-0 group-hover/quote:opacity-100 transition-opacity duration-200'>
						<button
							onClick={() =>
								onCopy(`${bookmark.quote} ${bookmark.author}`)
							}
							className='text-white/80 hover:text-white transition-colors duration-200'
							aria-label='Copy quote'
						>
							{isCopied ? (
								<IoCheckmark className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500' />
							) : (
								<IoCopyOutline className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
							)}
						</button>
						<button
							onClick={e => {
								const quoteElement =
									e.currentTarget.closest('.group\\/quote')
								if (quoteElement) {
									quoteElement.classList.add(
										'animate-fadeOutRight'
									)
									setTimeout(() => onRemove(bookmark.id), 300)
								}
							}}
							className='text-[#FFD700] hover:text-[#FFD700]/80 transition-colors duration-200'
							aria-label='Remove quote'
						>
							<svg
								className='h-3.5 w-3.5 sm:h-4 sm:w-4'
								viewBox='0 0 24 24'
								fill='currentColor'
								stroke='none'
							>
								<path d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z' />
							</svg>
						</button>
					</div>
				</div>
			) : (
				// Desktop layout
				<div className='flex items-center gap-2 pr-10'>
					<p className='text-white/80 text-sm line-clamp-1 font-medium max-w-[70%]'>
						&ldquo;{quoteText}&rdquo;
					</p>
					<p className='text-white/60 text-xs italic min-w-[80px] max-w-[150px] truncate'>
						-{authorText}
					</p>
					<div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-200'>
						<button
							onClick={() =>
								onCopy(`${bookmark.quote} ${bookmark.author}`)
							}
							className='text-white/80 hover:text-white transition-colors duration-200'
						>
							{isCopied ? (
								<IoCheckmark className='h-4 w-4 text-green-500' />
							) : (
								<IoCopyOutline className='h-4 w-4' />
							)}
						</button>
						<button
							onClick={e => {
								const quoteElement =
									e.currentTarget.closest('.group\\/quote')
								if (quoteElement) {
									quoteElement.classList.add(
										'animate-fadeOutRight'
									)
									setTimeout(() => onRemove(bookmark.id), 300)
								}
							}}
							className='text-[#FFD700] hover:text-[#FFD700]/80 transition-colors duration-200'
						>
							<svg
								className='h-4 w-4'
								viewBox='0 0 24 24'
								fill='currentColor'
								stroke='none'
							>
								<path d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z' />
							</svg>
						</button>
					</div>
				</div>
			)}
		</div>
	)
}
