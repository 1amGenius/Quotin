import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { BookmarkItem } from './bookmark-item'
import type { Bookmark } from '@/types/bookmark'

interface BookmarksDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
	bookmarks: Bookmark[]
	isCopied: boolean
	onCopy: (quote: string) => void
	onRemove: (id: string) => void
}

export function BookmarksDialog({
	isOpen,
	onOpenChange,
	bookmarks,
	isCopied,
	onCopy,
	onRemove,
}: BookmarksDialogProps) {
	const [currentPage, setCurrentPage] = useState(1)
	const [screenSize, setScreenSize] = useState<
		'mobile' | 'medium' | 'desktop'
	>('desktop')
	const itemsPerPage =
		screenSize === 'mobile' ? 5 : screenSize === 'medium' ? 7 : 10
	const totalPages = Math.ceil(bookmarks.length / itemsPerPage)

	// Check screen size more precisely
	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth
			if (width < 640) {
				setScreenSize('mobile')
			} else if (width < 1024) {
				setScreenSize('medium')
			} else {
				setScreenSize('desktop')
			}
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	const isMobile = screenSize === 'mobile'
	const isMedium = screenSize === 'medium'

	const getPaginatedBookmarks = () => {
		const startIndex = (currentPage - 1) * itemsPerPage
		const endIndex = startIndex + itemsPerPage
		return bookmarks
			.sort((a, b) => b.createdAt - a.createdAt)
			.slice(startIndex, endIndex)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent
				className={`bg-black/90 backdrop-blur-sm border border-white/10 text-white 
				${
					isMobile
						? 'w-[95vw] p-3 max-h-[95vh]'
						: isMedium
						? 'p-4 sm:max-w-[85vw] md:max-w-[90vw] max-h-[95vh]'
						: 'p-5 md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[95vh]'
				}`}
			>
				<DialogHeader className={isMobile ? 'text-center' : ''}>
					<DialogTitle
						className={`text-white/90 ${
							isMobile
								? 'text-base'
								: isMedium
								? 'text-lg'
								: 'text-xl'
						} font-medium`}
					>
						Manage Bookmarks
					</DialogTitle>
					<DialogDescription
						className={`${
							isMobile ? 'text-xs' : isMedium ? 'text-sm' : ''
						} truncate`}
					>
						{isMobile
							? 'Remove, copy or view saved quotes'
							: 'Remove, copy or view all of the bookmarks quotes you saved'}
					</DialogDescription>
				</DialogHeader>
				<div
					className={`${
						isMobile
							? 'mt-1 space-y-1'
							: isMedium
							? 'mt-2 space-y-2'
							: 'mt-3 space-y-3'
					}`}
				>
					{getPaginatedBookmarks().map(bookmark => (
						<div key={bookmark.id} className='group/quote relative'>
							<BookmarkItem
								bookmark={bookmark}
								isCopied={isCopied}
								onCopy={onCopy}
								onRemove={onRemove}
								className='hover:bg-white/5 rounded-lg'
								isMobile={isMobile || isMedium}
							/>
							<Separator
								className={`${
									isMobile ? 'my-1' : 'my-2'
								} bg-white/20`}
							/>
						</div>
					))}

					{bookmarks.length > itemsPerPage && (
						<div className='mt-2 flex justify-center'>
							<div className='flex items-center space-x-2'>
								<button
									onClick={() =>
										setCurrentPage(prev =>
											Math.max(1, prev - 1)
										)
									}
									disabled={currentPage === 1}
									className={`h-8 w-8 flex items-center justify-center rounded ${
										currentPage === 1
											? 'text-white/30 cursor-not-allowed'
											: 'text-white/70 hover:text-white hover:bg-white/10'
									}`}
								>
									<svg
										width='16'
										height='16'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
									>
										<path d='M15 18l-6-6 6-6' />
									</svg>
								</button>

								<span className='text-white/70 text-sm'>
									Page {currentPage} of {totalPages}
								</span>

								<button
									onClick={() =>
										setCurrentPage(prev =>
											Math.min(totalPages, prev + 1)
										)
									}
									disabled={currentPage === totalPages}
									className={`h-8 w-8 flex items-center justify-center rounded ${
										currentPage === totalPages
											? 'text-white/30 cursor-not-allowed'
											: 'text-white/70 hover:text-white hover:bg-white/10'
									}`}
								>
									<svg
										width='16'
										height='16'
										viewBox='0 0 24 24'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
									>
										<path d='M9 18l6-6-6-6' />
									</svg>
								</button>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
