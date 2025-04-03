import { IoCopyOutline, IoCheckmark } from 'react-icons/io5'
import { Bookmark } from '@/types/bookmark'

interface BookmarkItemProps {
	bookmark: Bookmark
	isCopied: boolean
	onCopy: (quote: string) => void
	onRemove: (id: string) => void
	className?: string
}

export function BookmarkItem({
	bookmark,
	isCopied,
	onCopy,
	onRemove,
	className = '',
}: BookmarkItemProps) {
	return (
		<div
			className={`group/quote relative transition-all duration-300 hover:bg-white/5 p-3 rounded-lg ${className}`}
		>
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
		</div>
	)
}
