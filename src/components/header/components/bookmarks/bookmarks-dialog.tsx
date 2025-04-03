import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
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
	const [isMobile, setIsMobile] = useState(false)
	const itemsPerPage = 10
	const totalPages = Math.ceil(bookmarks.length / itemsPerPage)

	// Check if we're on mobile
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 640)
		}

		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

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
						? 'w-[85vw] p-4 max-h-[80vh] overflow-y-auto'
						: 'p-6 sm:max-w-[50vw] md:max-w-[60vw] lg:max-w-[70vw]'
				}`}
			>
				<DialogHeader className={isMobile ? 'text-center' : ''}>
					<DialogTitle className='text-white/90 text-xl font-medium'>
						Manage Bookmarks
					</DialogTitle>
					<DialogDescription className={isMobile ? 'text-sm' : ''}>
						{isMobile
							? 'Remove, copy or see all saved quotes'
							: 'Remove, copy or see all of the bookmarks quotes you saved'}
					</DialogDescription>
				</DialogHeader>
				<div
					className={`${
						isMobile ? 'mt-2 space-y-2' : 'mt-4 space-y-4'
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
								isMobile={isMobile}
							/>
							<Separator className='my-2 bg-white/20' />
						</div>
					))}

					{bookmarks.length > itemsPerPage && (
						<div
							className={`w-full ${
								isMobile ? 'pt-2 flex justify-center' : 'pt-4'
							}`}
						>
							<Pagination>
								<PaginationContent
									className={`flex justify-center ${
										isMobile ? 'gap-1' : ''
									}`}
								>
									<PaginationItem>
										<PaginationPrevious
											className={cn(
												'text-white/80 hover:text-white',
												isMobile &&
													'scale-75 sm:scale-100 h-8 w-8',
												currentPage === 1 &&
													'pointer-events-none opacity-50'
											)}
											onClick={() =>
												setCurrentPage(prev =>
													Math.max(1, prev - 1)
												)
											}
										/>
									</PaginationItem>

									{Array.from(
										{ length: totalPages },
										(_, i) => i + 1
									)
										.filter(page => {
											// On mobile, only show current page and adjacent pages
											if (!isMobile) return true
											return (
												page === 1 ||
												page === totalPages ||
												Math.abs(page - currentPage) <=
													1
											)
										})
										.map(page => (
											<PaginationItem key={page}>
												<PaginationLink
													className={cn(
														'text-white/80 hover:text-white data-[active=true]:bg-white/10',
														isMobile &&
															'scale-75 sm:scale-100 h-8 w-8'
													)}
													isActive={
														currentPage === page
													}
													onClick={() =>
														setCurrentPage(page)
													}
												>
													{page}
												</PaginationLink>
											</PaginationItem>
										))}

									<PaginationItem>
										<PaginationNext
											className={cn(
												'text-white/80 hover:text-white',
												isMobile &&
													'scale-75 sm:scale-100 h-8 w-8',
												currentPage === totalPages &&
													'pointer-events-none opacity-50'
											)}
											onClick={() =>
												setCurrentPage(prev =>
													Math.min(
														totalPages,
														prev + 1
													)
												)
											}
										/>
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
