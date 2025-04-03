import { PopoverContent } from '@/components/ui/popover'
import { BookmarkItem } from './bookmark-item'
import { Bookmark } from '@/types/bookmark'

interface BookmarksPopoverProps {
	bookmarks: Bookmark[]
	isCopied: boolean
	onCopy: (quote: string) => void
	onRemove: (id: string) => void
	onViewAll: () => void
}

export function BookmarksPopover({
	bookmarks,
	isCopied,
	onCopy,
	onRemove,
	onViewAll,
}: BookmarksPopoverProps) {
	const topThreeBookmarks = bookmarks
		.sort((a, b) => b.createdAt - a.createdAt)
		.slice(0, 3)

	return (
		<PopoverContent className='md:w-[50vw] w-[90vw] bg-black/10 backdrop-blur-sm border border-white/10'>
			<div className='space-y-3'>
				{bookmarks.length === 0 ? (
					<p className='text-white/60 text-sm text-center italic'>
						No bookmarks yet. Save some quotes!
					</p>
				) : (
					<>
						{topThreeBookmarks.map(bookmark => (
							<BookmarkItem
								key={bookmark.id}
								bookmark={bookmark}
								isCopied={isCopied}
								onCopy={onCopy}
								onRemove={onRemove}
							/>
						))}

						{bookmarks.length > 3 && (
							<div className='pt-0'>
								<p className='text-white/40 text-xs italic tracking-wide transition-all duration-300 hover:text-white/60 cursor-default select-none'>
									and{' '}
									<span className='font-medium text-white/50 transition-colors duration-300 group-hover:text-[#ffd700]/50'>
										{bookmarks.length - 3}
									</span>{' '}
									more quotes...
								</p>
							</div>
						)}

						<hr className='border-white/10 my-3' />
						<button
							onClick={onViewAll}
							className='gradient-button mx-auto w-full md:w-[50%] text-white/80 text-sm hover:text-white p-1.5 rounded-lg flex items-center justify-center gap-2'
						>
							View and manage all
						</button>
					</>
				)}
			</div>
		</PopoverContent>
	)
}
