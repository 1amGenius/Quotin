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
	// Truncate quote text to prevent overflow
	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	// Get truncated versions based on screen size
	const quoteText = isMobile
		? truncateText(bookmark.quote, 60)
		: bookmark.quote
	const authorText = isMobile
		? truncateText(bookmark.author, 15)
		: bookmark.author

	return (
		<div
			className={`group/quote relative transition-all duration-300 ${
				isMobile ? 'p-2' : 'hover:bg-white/5 p-3'
			} rounded-lg ${className}`}
		>
			{isMobile ? (
				// Mobile layout
				<div className='flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pr-8'>
					<p className='text-white/80 text-xs sm:text-sm line-clamp-2 sm:line-clamp-1 font-medium w-full sm:max-w-[65%]'>
						&ldquo;{quoteText}&rdquo;
					</p>
					<p className='text-white/60 text-xs italic truncate w-[120px]'>
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
								<IoCheckmark className='h-4 w-4 sm:h-5 sm:w-5 text-green-500' />
							) : (
								<IoCopyOutline className='h-4 w-4 sm:h-5 sm:w-5' />
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
								className='h-4 w-4 sm:h-5 sm:w-5'
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
				// Desktop layout - original design
				<div className='flex items-center md:gap-4 gap-2 pr-12'>
					<p className='text-white/80 text-sm truncate font-bold md:max-w-[90%] max-w-[70%]'>
						{bookmark.quote}
					</p>
					<p className='text-white/60 text-sm italic md:min-w-[130px] md:max-w-[270px] min-w-[80px] max-w-[80px] truncate'>
						-{bookmark.author}
					</p>
					<div className='absolute right-2 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover/quote:opacity-100 transition-opacity duration-200'>
						<button
							onClick={() =>
								onCopy(`${bookmark.quote} ${bookmark.author}`)
							}
							className='text-white/80 hover:text-white transition-colors duration-200'
						>
							{isCopied ? (
								<IoCheckmark className='h-5 w-5 text-green-500' />
							) : (
								<IoCopyOutline className='h-5 w-5' />
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
								className='h-5 w-5'
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
