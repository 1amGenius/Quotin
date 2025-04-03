'use client'
import { useState } from 'react'
import { useBookmarks } from '@/context/BookmarkContext'
import { Popover } from '@/components/ui/popover'
import { toast } from 'sonner'
import { GitHubButton } from './components/github-button'
import { BookmarksButton } from './components/bookmarks/bookmarks-button'
import { BookmarksPopover } from './components/bookmarks/bookmarks-popover'
import { BookmarksDialog } from './components/bookmarks/bookmarks-dialog'
import { PreferencesButton } from './components/preferences/preferences-button'
import { PreferencesPopover } from './components/preferences/preferences-popover'
import { CategoriesDialog } from './components/preferences/categories-dialog'

export default function Header() {
	const { bookmarks, removeBookmark } = useBookmarks()
	const [isCopied, setIsCopied] = useState(false)
	const [isBookmarksOpen, setIsBookmarksOpen] = useState(false)
	const [isPreferencesOpen, setIsPreferencesOpen] = useState(false)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isColorsDialogOpen, setIsColorsDialogOpen] = useState(false)
	const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false)

	const handleCopy = async (quote: string) => {
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(quote)
			} else {
				const textArea = document.createElement('textarea')
				textArea.value = quote
				textArea.style.position = 'fixed'
				textArea.style.left = '-999999px'
				textArea.style.top = '-999999px'
				document.body.appendChild(textArea)
				textArea.focus()
				textArea.select()
				document.execCommand('copy')
				textArea.remove()
			}

			setIsCopied(true)
			toast.success('Copied to clipboard!', {
				position: 'bottom-right',
				duration: 2000,
			})
			setTimeout(() => setIsCopied(false), 2000)
		} catch {
			toast.error('Failed to copy to clipboard', {
				position: 'bottom-right',
				duration: 2000,
			})
		}
	}

	const handleRemoveBookmark = (id: string) => {
		removeBookmark(id)
		toast.success('Quote removed from bookmarks!', {
			position: 'bottom-right',
			duration: 2000,
		})
	}

	const handleCategoriesClick = () => {
		setIsCategoriesDialogOpen(true)
	}

	const handleColorsClick = () => {
		setIsColorsDialogOpen(true)
	}

	return (
		<header className='fixed top-0 left-0 right-0 z-50 p-4'>
			<div className='max-w-[90vw] md:max-w-[600px] mx-auto'>
				<div className='group bg-white/15 backdrop-blur-[100px] border border-white/20 shadow-sm shadow-white/10 rounded-xl p-3 flex items-center justify-center gap-3 md:gap-20 before:absolute relative'>
					<GitHubButton />

					<Popover
						open={isBookmarksOpen}
						onOpenChange={setIsBookmarksOpen}
					>
						<BookmarksButton isOpen={isBookmarksOpen} />
						<BookmarksPopover
							bookmarks={bookmarks}
							isCopied={isCopied}
							onCopy={handleCopy}
							onRemove={handleRemoveBookmark}
							onViewAll={() => {
								setIsDialogOpen(true)
								setIsBookmarksOpen(false)
							}}
						/>
					</Popover>

					<Popover
						open={isPreferencesOpen}
						onOpenChange={setIsPreferencesOpen}
					>
						<PreferencesButton isOpen={isPreferencesOpen} />
						<PreferencesPopover
							onCategoriesClick={handleCategoriesClick}
							onColorsClick={handleColorsClick}
							isColorsDialogOpen={isColorsDialogOpen}
							onColorsDialogOpenChange={setIsColorsDialogOpen}
							isCategoriesDialogOpen={isCategoriesDialogOpen}
							onCategoriesDialogOpenChange={
								setIsCategoriesDialogOpen
							}
						/>
					</Popover>
				</div>
			</div>

			<BookmarksDialog
				isOpen={isDialogOpen}
				onOpenChange={setIsDialogOpen}
				bookmarks={bookmarks}
				isCopied={isCopied}
				onCopy={handleCopy}
				onRemove={handleRemoveBookmark}
			/>

			<CategoriesDialog
				isOpen={isCategoriesDialogOpen}
				onOpenChange={setIsCategoriesDialogOpen}
			/>
		</header>
	)
}
