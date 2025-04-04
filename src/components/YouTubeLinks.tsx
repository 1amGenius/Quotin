'use client'

import { useState, useEffect } from 'react'
import {
	TbTrash,
	TbPlus,
	TbBrandYoutube,
	TbExternalLink,
	TbX,
} from 'react-icons/tb'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
	DrawerTitle,
} from '@/components/ui/drawer'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// Interface for YouTube link
interface YouTubeLink {
	id: string
	title: string
	url: string
	type: 'video' | 'playlist'
	timestamp: number
}

// Storage key
const YOUTUBE_LINKS_KEY = 'youtube-links'

// YouTube link validation regex
const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(.+)$/i
const YOUTUBE_PLAYLIST_REGEX = /[&?]list=([^&]+)/i

// Custom hook to detect screen size
const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const media = window.matchMedia(query)
			setMatches(media.matches)

			const listener = (e: MediaQueryListEvent) => {
				setMatches(e.matches)
			}

			media.addEventListener('change', listener)

			return () => {
				media.removeEventListener('change', listener)
			}
		}
		return undefined
	}, [query])

	return matches
}

// Self-contained form component with isolated state
function AddLinkForm({
	onSubmit,
	onCancel,
	isLoading,
	getDefaultTitle,
}: {
	onSubmit: (url: string, title: string) => void
	onCancel: () => void
	isLoading: boolean
	getDefaultTitle: (url: string) => string
}) {
	const [formUrl, setFormUrl] = useState('')
	const [formTitle, setFormTitle] = useState('')

	// Update title when URL changes
	useEffect(() => {
		if (formUrl && !formTitle) {
			setFormTitle(getDefaultTitle(formUrl))
		}
	}, [formUrl, formTitle, getDefaultTitle])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(formUrl, formTitle)
		// Reset form
		setFormUrl('')
		setFormTitle('')
	}

	// Clear URL field
	const clearUrlField = () => {
		setFormUrl('')
		// Also clear title if it was auto-generated
		if (formTitle === getDefaultTitle(formUrl)) {
			setFormTitle('')
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='flex flex-col gap-3'>
				<div>
					<label
						htmlFor='youtube-url'
						className='text-sm text-white/80 mb-1 block'
					>
						YouTube URL
					</label>
					<div className='flex gap-2'>
						<div className='relative flex-1'>
							<Input
								id='youtube-url'
								placeholder='Paste YouTube URL here'
								value={formUrl}
								onChange={e => setFormUrl(e.target.value)}
								className='bg-black/50 border-white/20 text-white placeholder:text-white/40 w-full pr-8'
								disabled={isLoading}
							/>
							{formUrl && (
								<button
									type='button'
									onClick={clearUrlField}
									className='absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white'
									disabled={isLoading}
								>
									<TbX className='h-4 w-4' />
								</button>
							)}
						</div>
						<Button
							type='submit'
							className='bg-white/10 hover:bg-white/20 text-white hover:text-white active:text-white'
							disabled={isLoading}
						>
							{isLoading ? 'Adding...' : 'Add'}
						</Button>
					</div>
				</div>

				<div>
					<label
						htmlFor='youtube-title'
						className='text-sm text-white/80 mb-1 block'
					>
						Title
					</label>
					<Input
						id='youtube-title'
						placeholder='Enter custom title for this link'
						value={formTitle}
						onChange={e => setFormTitle(e.target.value)}
						className='bg-black/50 border-white/20 text-white placeholder:text-white/40 w-full'
						disabled={isLoading}
					/>
				</div>
			</div>

			<p className='text-xs text-white/50 mt-2'>
				Enter a YouTube video or playlist URL
			</p>
			<div className='flex justify-end mt-3'>
				<Button
					type='button'
					variant='ghost'
					onClick={() => {
						setFormUrl('')
						setFormTitle('')
						onCancel()
					}}
					className='bg-white/10 hover:bg-white/20 text-white hover:text-white active:text-white'
					disabled={isLoading}
				>
					Cancel
				</Button>
			</div>
		</form>
	)
}

export default function YouTubeLinks() {
	const [isOpen, setIsOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [links, setLinks] = useState<YouTubeLink[]>([])
	const [isAddingLink, setIsAddingLink] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [quickOpen, setQuickOpen] = useState(false)

	// Add keyboard shortcut to open dialog/drawer
	useEffect(() => {
		// Track pressed keys
		const pressedKeys = new Set<string>()

		const handleKeyDown = (e: KeyboardEvent) => {
			// Add key to set (lowercase for consistency)
			pressedKeys.add(e.key.toLowerCase())

			// Check if Ctrl/Cmd + Y + L are pressed
			if (
				(pressedKeys.has('control') || pressedKeys.has('meta')) &&
				pressedKeys.has('y') &&
				pressedKeys.has('l')
			) {
				setIsOpen(true)
				e.preventDefault()
			}
		}

		const handleKeyUp = (e: KeyboardEvent) => {
			// Remove key from set when released
			pressedKeys.delete(e.key.toLowerCase())
		}

		window.addEventListener('keydown', handleKeyDown)
		window.addEventListener('keyup', handleKeyUp)

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
			window.removeEventListener('keyup', handleKeyUp)
		}
	}, [])

	// Load links from local storage
	useEffect(() => {
		const loadLinks = () => {
			try {
				const savedLinks = localStorage.getItem(YOUTUBE_LINKS_KEY)
				if (savedLinks) {
					setLinks(JSON.parse(savedLinks))
				}
			} catch (error) {
				console.error('Error loading YouTube links:', error)
			}
		}

		if (typeof window !== 'undefined') {
			loadLinks()
		}
	}, [])

	// Save links to local storage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem(YOUTUBE_LINKS_KEY, JSON.stringify(links))
		}
	}, [links])

	// Validate YouTube URL
	const isValidYouTubeUrl = (url: string): boolean => {
		return YOUTUBE_REGEX.test(url)
	}

	// Check if URL is a playlist
	const isPlaylist = (url: string): boolean => {
		return YOUTUBE_PLAYLIST_REGEX.test(url)
	}

	// Remove a YouTube link
	const removeLink = (id: string) => {
		setLinks(prev => prev.filter(link => link.id !== id))
		toast.success('Link removed successfully')
	}

	// Open a YouTube link
	const openYouTubeLink = (url: string) => {
		if (typeof window !== 'undefined') {
			window.open(url, '_blank')
		}
	}

	// Modified trigger button with direct link open functionality
	const TriggerButton = (
		props: React.ButtonHTMLAttributes<HTMLButtonElement>
	) => {
		// Remove all the timer code and simplify to direct event handlers
		return (
			<button
				className='h-14 w-14 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-white/70 hover:scale-105 hover:bg-black/70'
				onClick={() => {
					// Handle quickOpen flag
					if (quickOpen && links.length > 0) {
						openYouTubeLink(links[0].url)
						toast.success(`Opening ${links[0].title}...`)
						setQuickOpen(false)
						return
					}

					// Regular click opens the drawer/dialog
					setIsOpen(true)
				}}
				onDoubleClick={e => {
					e.stopPropagation()
					e.preventDefault()

					if (links.length > 0) {
						openYouTubeLink(links[0].url)
						toast.success(`Opening ${links[0].title}...`)
					} else {
						toast.error('No YouTube links saved yet')
					}
				}}
				{...props}
			>
				<TbBrandYoutube className='h-6 w-6 text-red-500' />
			</button>
		)
	}

	// Check if we have content
	const hasContent = links.length > 0

	// Common content for both dialog and drawer
	const LinksContent = ({ showHeader = true }: { showHeader?: boolean }) => (
		<>
			{/* Header */}
			<div className='border-b border-white/10 pb-4 flex items-center justify-between'>
				{showHeader && (
					<div className='flex items-center gap-2'>
						<TbBrandYoutube className='h-5 w-5 text-red-500' />
						<h2 className='text-xl font-medium text-white/90'>
							YouTube Links
						</h2>
					</div>
				)}

				<div className='flex items-center ml-auto'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setIsAddingLink(true)}
						title='Add YouTube Link'
						className='bg-white/10 hover:bg-white/20 text-white hover:text-white active:text-white rounded-full h-10 w-10'
					>
						<TbPlus className='h-5 w-5' />
					</Button>
				</div>
			</div>

			{/* Add link form */}
			{isAddingLink && (
				<div className='p-4 bg-black/20 border-b border-white/10'>
					<h3 className='text-lg font-medium text-white/80 mb-3'>
						Add YouTube Link
					</h3>
					<AddLinkForm
						onSubmit={(url, title) => {
							if (!isValidYouTubeUrl(url)) {
								toast.error('Please enter a valid YouTube URL')
								return
							}

							setIsLoading(true)

							try {
								const linkType = isPlaylist(url)
									? 'playlist'
									: 'video'
								// Use the manually entered title
								const finalTitle =
									title.trim() ||
									(linkType === 'playlist'
										? 'YouTube Playlist'
										: 'YouTube Video')

								const newLink: YouTubeLink = {
									id: `yt-${Date.now()}`,
									title: finalTitle,
									url: url,
									type: linkType,
									timestamp: Date.now(),
								}

								setLinks(prev => [newLink, ...prev])
								setIsAddingLink(false)
								toast.success(
									`${
										linkType === 'playlist'
											? 'Playlist'
											: 'Video'
									} added successfully`
								)
							} catch (error) {
								console.error(
									'Error adding YouTube link:',
									error
								)
								toast.error(
									'Failed to add link. Please try again.'
								)
							} finally {
								setIsLoading(false)
							}
						}}
						onCancel={() => {
							setIsAddingLink(false)
						}}
						isLoading={isLoading}
						getDefaultTitle={url =>
							isPlaylist(url)
								? 'YouTube Playlist'
								: 'YouTube Video'
						}
					/>
				</div>
			)}

			{!hasContent && !isAddingLink ? (
				<div className='flex flex-col items-center justify-center py-16 px-4'>
					<div className='w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center mb-6'>
						<TbBrandYoutube className='h-10 w-10 text-red-500' />
					</div>
					<h3 className='text-xl font-medium text-white/80 text-center mb-2'>
						No YouTube links yet
					</h3>
					<p className='text-white/50 text-center max-w-md mb-6'>
						Add YouTube videos or playlists to quick access them
						later
					</p>
					<Button
						onClick={() => setIsAddingLink(true)}
						className='bg-white/10 hover:bg-white/20 text-white flex items-center gap-2'
					>
						<TbPlus className='h-4 w-4' />
						Add YouTube Link
					</Button>
				</div>
			) : (
				<>
					{/* Links section */}
					<div className='p-4 pt-2 pb-6'>
						{!isAddingLink && hasContent && (
							<h3 className='text-lg font-medium text-white/80 mb-3'>
								Your Links
							</h3>
						)}

						<div className='space-y-2'>
							{links.map(link => (
								<div
									key={link.id}
									className='flex items-center justify-between p-3 rounded-md hover:bg-white/5 transition-colors border border-white/5 bg-black/20'
								>
									<div
										className='flex-1 cursor-pointer overflow-hidden mr-2'
										onClick={() =>
											openYouTubeLink(link.url)
										}
									>
										<div className='flex items-center gap-2'>
											<TbBrandYoutube
												className={`h-5 w-5 flex-shrink-0 ${
													link.type === 'playlist'
														? 'text-blue-400'
														: 'text-red-500'
												}`}
											/>
											<h4 className='font-medium truncate'>
												{link.title}
											</h4>
										</div>
										<p className='text-sm text-white/50 truncate mt-1'>
											{link.url}
										</p>
									</div>
									<div className='flex items-center gap-2 flex-shrink-0'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												openYouTubeLink(link.url)
											}
											className='bg-white/10 hover:bg-white/20 text-white hover:text-white active:text-white rounded-full h-8 w-8 flex-shrink-0'
										>
											<TbExternalLink className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => removeLink(link.id)}
											className='bg-white/10 hover:bg-white/20 text-white hover:text-white active:text-white rounded-full h-8 w-8 flex-shrink-0'
										>
											<TbTrash className='h-4 w-4' />
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}

			{/* Footer */}
			<div className='border-t border-white/10 bg-black/80 backdrop-blur-md p-3 flex justify-between items-center mt-auto'>
				<p className='text-xs text-white/50'>YouTube Quick Links</p>
				<button
					className='text-white/70 hover:text-white text-sm'
					onClick={() => setIsAddingLink(true)}
				>
					{hasContent ? 'Add another link' : 'Add YouTube link'}
				</button>
			</div>
		</>
	)

	return (
		<>
			{isDesktop ? (
				// Dialog for desktop
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<div className='fixed left-6 bottom-6 z-50'>
						<div className='relative'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<DialogTrigger asChild>
											<div>
												<TriggerButton />
											</div>
										</DialogTrigger>
									</TooltipTrigger>
									<TooltipContent className='bg-black/80 text-white border border-white/20'>
										<div className='space-y-1'>
											<p>YouTube Links</p>
											<div className='flex items-center gap-2 pt-1 border-t border-white/10'>
												<button
													className='text-xs text-white/70 hover:text-white bg-white/10 py-0.5 px-2 rounded-sm'
													onClick={e => {
														e.stopPropagation()
														setQuickOpen(true)
														if (links.length > 0) {
															openYouTubeLink(
																links[0].url
															)
														} else {
															toast.error(
																'No YouTube links saved yet'
															)
														}
													}}
												>
													Quick Open
												</button>
												<p className='text-xs text-white/50'>
													or double-click to open
													latest link
												</p>
											</div>
											<div className='flex items-center gap-2 pt-1 border-t border-white/10'>
												<p className='text-xs text-white/50'>
													Keyboard shortcut:{' '}
													<span className='bg-white/10 px-1 rounded'>
														{typeof navigator !==
															'undefined' &&
														navigator?.userAgent?.indexOf(
															'Mac'
														) !== -1 ? (
															<>
																<kbd>⌘</kbd> +{' '}
																<kbd>Y</kbd> +{' '}
																<kbd>L</kbd>
															</>
														) : (
															<>
																<kbd>Ctrl</kbd>{' '}
																+ <kbd>Y</kbd> +{' '}
																<kbd>L</kbd>
															</>
														)}
													</span>
												</p>
											</div>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</div>

					<DialogContent
						className='bg-black/90 text-white backdrop-blur-md border border-white/10 max-w-none w-[70vw] h-[80vh] overflow-y-auto !sm:max-w-none'
						style={{ maxWidth: '60vw' }}
					>
						<DialogHeader className='p-0 text-left'>
							<DialogTitle className='text-xl font-medium text-white/90 flex items-center gap-2 pb-2'>
								<TbBrandYoutube className='h-5 w-5 text-red-500' />{' '}
								YouTube Links
							</DialogTitle>
							<LinksContent showHeader={false} />
						</DialogHeader>
					</DialogContent>
				</Dialog>
			) : (
				// Drawer for mobile
				<Drawer open={isOpen} onOpenChange={setIsOpen}>
					<div className='fixed left-6 bottom-6 z-50'>
						<div className='relative'>
							<DrawerTrigger asChild>
								<div>
									<TriggerButton />
								</div>
							</DrawerTrigger>
						</div>
					</div>

					<DrawerContent className='bg-black/90 text-white backdrop-blur-md border-t border-white/10 max-w-full'>
						<DrawerHeader className='p-4'>
							<DrawerTitle className='text-xl font-medium text-white/90 flex items-center gap-2 pb-2 truncate'>
								<TbBrandYoutube className='h-5 w-5 text-red-500 flex-shrink-0' />{' '}
								YouTube Links
							</DrawerTitle>
							<LinksContent showHeader={false} />
						</DrawerHeader>
					</DrawerContent>
				</Drawer>
			)}
		</>
	)
}
