'use client'
import { useState } from 'react'
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5'
import { TbRefresh, TbLanguage } from 'react-icons/tb'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { storage } from '@/lib/storage'
import { useBookmarks } from '@/context/BookmarkContext'

interface ActionButtonsProps {
	quoteToCopy: string
	onRefresh: () => Promise<void>
}

export default function ActionButtons({
	onRefresh,
	quoteToCopy,
}: ActionButtonsProps) {
	const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [isCopied, setIsCopied] = useState(false)
	const [isTranslating, setIsTranslating] = useState(false)

	// Extract quote and author from quoteToCopy
	const [quote, author] = quoteToCopy.split(' -')

	const handleCopy = async () => {
		try {
			// Try the modern clipboard API first
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(quoteToCopy)
			} else {
				// Fallback for mobile devices
				const textArea = document.createElement('textarea')
				textArea.value = quoteToCopy
				textArea.style.position = 'fixed'
				textArea.style.left = '-999999px'
				textArea.style.top = '-999999px'
				document.body.appendChild(textArea)
				textArea.focus()
				textArea.select()
				document.execCommand('copy')
				textArea.remove()
			}

			// Show success feedback
			setIsCopied(true)
			toast.success('Copied to clipboard!', {
				position: 'bottom-right',
				duration: 2000,
			})
			// Reset after animation
			setTimeout(() => setIsCopied(false), 2000)
		} catch {
			// Show error feedback
			toast.error('Failed to copy to clipboard', {
				position: 'bottom-right',
				duration: 2000,
			})
		}
	}

	const handleRefresh = async () => {
		if (isRefreshing) return
		setIsRefreshing(true)
		try {
			await onRefresh()
			toast.success('New quote loaded!', {
				position: 'bottom-right',
				duration: 2000,
			})
		} catch {
			toast.error('Failed to load new quote', {
				position: 'bottom-right',
				duration: 2000,
			})
		} finally {
			setIsRefreshing(false)
		}
	}

	const handleBookmarkToggle = () => {
		if (isBookmarked(quote)) {
			// Find the bookmark ID to remove
			const bookmarkToRemove = storage
				.getBookmarks()
				.find(b => b.quote === quote)
			if (bookmarkToRemove) {
				removeBookmark(bookmarkToRemove.id)
				toast.success('Quote removed from bookmarks!', {
					position: 'bottom-right',
					duration: 2000,
				})
			}
		} else {
			addBookmark(quote, author)
			toast.success('Quote added to bookmarks!', {
				position: 'bottom-right',
				duration: 2000,
			})
		}
	}

	const handleTranslate = () => {
		setIsTranslating(true)
		// Open translation in a new window/tab
		const googleTranslateUrl = `https://translate.google.com/?sl=auto&tl=auto&text=${encodeURIComponent(
			quote
		)}&op=translate`
		window.open(googleTranslateUrl, '_blank')

		setTimeout(() => {
			setIsTranslating(false)
		}, 1000)
	}

	return (
		<>
			<div className='absolute z-1 -top-10.5 right-4 bg-black/10 border-t border-l border-r border-white/10 backdrop-blur-sm rounded-lg p-2 transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className='text-white/80 mr-2 hover:text-white transition-colors duration-200'
								onClick={handleBookmarkToggle}
							>
								<svg
									className='h-5 w-5'
									viewBox='0 0 24 24'
									fill={
										isBookmarked(quote) ? '#FFD700' : 'none'
									}
									stroke='currentColor'
									strokeWidth='1.5'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path
										d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
										className='transition-all duration-300'
									/>
								</svg>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{isBookmarked(quote)
									? 'Bookmarked'
									: 'Bookmark'}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className={`text-white/80 border-l border-white/30 px-2 hover:text-white transition-all duration-300 ${
									isCopied ? 'text-green-400' : ''
								}`}
								onClick={handleCopy}
							>
								{isCopied ? (
									<IoCheckmark className='h-5 w-5 transform scale-110 transition-all duration-300' />
								) : (
									<IoCopyOutline className='h-5 w-5 transition-all duration-300' />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{isCopied ? 'Copied!' : 'Copy'}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className='text-white/80 border-l border-white/30 px-2 hover:text-white transition-colors duration-200'
								onClick={handleTranslate}
								disabled={isTranslating}
							>
								<TbLanguage
									className={`h-5 w-5 ${
										isTranslating ? 'animate-pulse' : ''
									}`}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								{isTranslating ? 'Translating...' : 'Translate'}
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								className='text-white/80 border-l border-white/30 pl-2 hover:text-white transition-colors duration-200'
								onClick={handleRefresh}
								disabled={isRefreshing}
							>
								<TbRefresh
									className={`h-5 w-5 ${
										isRefreshing ? 'animate-spin' : ''
									}`}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{isRefreshing ? 'Loading...' : 'New Quote'}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</>
	)
}
