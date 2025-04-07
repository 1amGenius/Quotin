'use client'

import { useState, useEffect } from 'react'
import {
	TbTrash,
	TbPlus,
	TbBrandPinterest,
	TbExternalLink,
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
import Link from 'next/link'

// Interface for Pinterest link
interface PinterestLink {
	id: string
	title: string
	url: string
	type: 'pin' | 'board' | 'profile'
	timestamp: number
}

// Storage key
const PINTEREST_LINKS_KEY = 'pinterest-links'

// Pinterest link validation regex
const PINTEREST_REGEX =
	/^(https?:\/\/)?(www\.)?(pinterest\.(com|co\.uk|ca|de|fr|it|es|nl|ru|jp|au|nz|br|mx|ar|cl|co|pe|ve|ec|pt|gr|tr|dk|fi|no|se|pl|cz|hu|ro|bg|hr|si|sk|at|ch|ie|be|lu|mt|cy|ee|lv|lt|is|mk|al|ba|me|rs|md|ua|by|kz|ge|am|az|il|ae|sa|kw|qa|bh|om|ye|jo|lb|sy|iq|ir|af|pk|in|lk|np|bd|bt|mv|my|sg|id|ph|vn|th|kh|la|mm|kr|jp|cn|tw|hk|mo|mn)\/(.+)|pin\.it\/[a-zA-Z0-9]+)$/i

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

	return (
		<form onSubmit={handleSubmit}>
			<div className='flex flex-col gap-3'>
				<div>
					<label
						htmlFor='pinterest-url'
						className='text-sm text-white/80 mb-1 block'
					>
						Pinterest URL
					</label>
					<div className='flex gap-2'>
						<Input
							id='pinterest-url'
							placeholder='Paste Pinterest URL here'
							value={formUrl}
							onChange={e => setFormUrl(e.target.value)}
							className='bg-black/50 border-white/20 text-white placeholder:text-white/40 flex-1'
							disabled={isLoading}
						/>
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
						htmlFor='pinterest-title'
						className='text-sm text-white/80 mb-1 block'
					>
						Title
					</label>
					<Input
						id='pinterest-title'
						placeholder='Enter custom title for this link'
						value={formTitle}
						onChange={e => setFormTitle(e.target.value)}
						className='bg-black/50 border-white/20 text-white placeholder:text-white/40 w-full'
						disabled={isLoading}
					/>
				</div>
			</div>

			<p className='text-xs text-white/50 mt-2'>
				Enter a Pinterest pin, board, or profile URL
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

// Convert pin.it URL to full Pinterest URL
const convertPinItUrl = async (url: string): Promise<string> => {
	if (url.includes('pin.it/')) {
		try {
			const response = await fetch(url, {
				method: 'HEAD',
				redirect: 'follow',
			})
			return response.url
		} catch (error) {
			console.error('Error converting pin.it URL:', error)
			return url
		}
	}
	return url
}

export default function PinterestLinks() {
	const [isOpen, setIsOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [links, setLinks] = useState<PinterestLink[]>([])
	const [isAddingLink, setIsAddingLink] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [quickOpen, setQuickOpen] = useState(false)

	// Add keyboard shortcut for opening Pinterest links
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+P or Command+P
			if (
				(event.ctrlKey || event.metaKey) &&
				event.key.toLowerCase() === 'p'
			) {
				event.preventDefault() // Prevent default browser behavior
				setIsOpen(true)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	// Load links from local storage
	useEffect(() => {
		const loadLinks = () => {
			try {
				const savedLinks = localStorage.getItem(PINTEREST_LINKS_KEY)
				if (savedLinks) {
					setLinks(JSON.parse(savedLinks))
				}
			} catch (error) {
				console.error('Error loading Pinterest links:', error)
			}
		}

		if (typeof window !== 'undefined') {
			loadLinks()
		}
	}, [])

	// Save links to local storage
	useEffect(() => {
		if (typeof window !== 'undefined' && links.length > 0) {
			localStorage.setItem(PINTEREST_LINKS_KEY, JSON.stringify(links))
		}
	}, [links])

	// Validate Pinterest URL
	const isValidPinterestUrl = (url: string): boolean => {
		return PINTEREST_REGEX.test(url)
	}

	// Determine link type
	const getLinkType = (url: string): 'pin' | 'board' | 'profile' => {
		if (url.includes('/pin/')) return 'pin'
		if (url.includes('/board/')) return 'board'
		return 'profile'
	}

	// Remove a Pinterest link
	const removeLink = (id: string) => {
		setLinks(prev => prev.filter(link => link.id !== id))
		toast.success('Link removed successfully')
	}

	// Open a Pinterest link
	const openPinterestLink = (url: string) => {
		if (typeof window !== 'undefined') {
			window.open(url, '_blank')
		}
	}

	// Modified trigger button with direct link open functionality
	const TriggerButton = (
		props: React.ButtonHTMLAttributes<HTMLButtonElement>
	) => (
		<button
			className='h-14 w-14 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-white/70 hover:scale-105 hover:bg-black/70'
			onClick={() => {
				if (quickOpen && links.length > 0) {
					openPinterestLink(links[0].url)
					toast.success(`Opening ${links[0].title}...`)
					setQuickOpen(false)
				}
			}}
			onDoubleClick={() => {
				if (links.length > 0) {
					openPinterestLink(links[0].url)
					toast.success(`Opening ${links[0].title}...`)
				} else {
					toast.error('No Pinterest links saved yet')
				}
			}}
			{...props}
		>
			<TbBrandPinterest className='h-6 w-6 text-red-500' />
		</button>
	)

	// Check if we have content
	const hasContent = links.length > 0

	// Common content for both dialog and drawer
	const LinksContent = ({ showHeader = true }: { showHeader?: boolean }) => (
		<>
			{/* Header */}
			<div className='border-b border-white/10 pb-4 flex items-center justify-between'>
				{showHeader && (
					<div className='flex items-center gap-2'>
						<TbBrandPinterest className='h-5 w-5 text-red-500' />
						<h2 className='text-xl font-medium text-white/90'>
							Pinterest Links
						</h2>
					</div>
				)}

				<div className='flex items-center ml-auto'>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setIsAddingLink(true)}
						title='Add Pinterest Link'
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
						Add Pinterest Link
					</h3>
					<AddLinkForm
						onSubmit={(url, title) => {
							if (!isValidPinterestUrl(url)) {
								toast.error(
									'Please enter a valid Pinterest URL'
								)
								return
							}

							setIsLoading(true)

							// Convert pin.it URL if necessary
							convertPinItUrl(url)
								.then(convertedUrl => {
									try {
										const linkType =
											getLinkType(convertedUrl)
										const finalTitle =
											title.trim() ||
											(linkType === 'pin'
												? 'Pinterest Pin'
												: linkType === 'board'
												? 'Pinterest Board'
												: 'Pinterest Profile')

										const newLink: PinterestLink = {
											id: `pin-${Date.now()}`,
											title: finalTitle,
											url: convertedUrl,
											type: linkType,
											timestamp: Date.now(),
										}

										setLinks(prev => [newLink, ...prev])
										setIsAddingLink(false)
										toast.success(
											`${finalTitle} added successfully`
										)
									} catch (error) {
										console.error(
											'Error adding Pinterest link:',
											error
										)
										toast.error(
											'Failed to add link. Please try again.'
										)
									} finally {
										setIsLoading(false)
									}
								})
								.catch(error => {
									console.error(
										'Error converting URL:',
										error
									)
									toast.error(
										'Failed to process URL. Please try again.'
									)
									setIsLoading(false)
								})
						}}
						onCancel={() => {
							setIsAddingLink(false)
						}}
						isLoading={isLoading}
						getDefaultTitle={url => {
							const type = getLinkType(url)
							return type === 'pin'
								? 'Pinterest Pin'
								: type === 'board'
								? 'Pinterest Board'
								: 'Pinterest Profile'
						}}
					/>
				</div>
			)}

			{!hasContent && !isAddingLink ? (
				<div className='flex flex-col items-center justify-center py-16 px-4'>
					<div className='w-20 h-20 rounded-full border-2 border-white/40 flex items-center justify-center mb-6'>
						<TbBrandPinterest className='h-10 w-10 text-red-500' />
					</div>
					<h3 className='text-xl font-medium text-white/80 text-center mb-2'>
						No Pinterest links yet
					</h3>
					<p className='text-white/50 text-center max-w-md mb-6'>
						Add Pinterest pins, boards, or profiles to quick access
						them later
					</p>
					<Button
						onClick={() => setIsAddingLink(true)}
						className='bg-white/10 hover:bg-white/20 text-white flex items-center gap-2'
					>
						<TbPlus className='h-4 w-4' />
						Add Pinterest Link
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
											openPinterestLink(link.url)
										}
									>
										<div className='flex items-center gap-2'>
											<TbBrandPinterest
												className={`h-5 w-5 flex-shrink-0 ${
													link.type === 'pin'
														? 'text-red-500'
														: link.type === 'board'
														? 'text-blue-400'
														: 'text-green-400'
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
												openPinterestLink(link.url)
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
				<p className='text-xs text-white/50'>
					<Link
						target='_blank'
						href='https://www.pinterest.com/'
						className='text-red-500 underline transition-colors duration-300 ease-in-out hover:no-underline hover:text-white/50'
					>
						Pinterest
					</Link>{' '}
					Quick Links
				</p>
				<button
					className='text-white/70 hover:text-white text-sm'
					onClick={() => setIsAddingLink(true)}
				>
					{hasContent ? 'Add another link' : 'Add Pinterest link'}
				</button>
			</div>
		</>
	)

	return (
		<>
			{isDesktop ? (
				// Dialog for desktop
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<div className='relative'>
						<div className='relative'>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<DialogTrigger asChild>
											<div
												onClick={e => {
													if (
														quickOpen &&
														links.length > 0
													) {
														e.preventDefault()
														e.stopPropagation()
														openPinterestLink(
															links[0].url
														)
														toast.success(
															`Opening ${links[0].title}...`
														)
														setQuickOpen(false)
													}
												}}
											>
												<TriggerButton />
											</div>
										</DialogTrigger>
									</TooltipTrigger>
									<TooltipContent className='bg-black/80 text-white border border-white/20'>
										<div className='space-y-1'>
											<p>Pinterest Links</p>
											<div className='flex items-center gap-2 pt-1 border-t border-white/10'>
												<button
													className='text-xs text-white/70 hover:text-white bg-white/10 py-0.5 px-2 rounded-sm'
													onClick={e => {
														e.stopPropagation()
														setQuickOpen(true)
														if (links.length > 0) {
															openPinterestLink(
																links[0].url
															)
														} else {
															toast.error(
																'No Pinterest links saved yet'
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
								<TbBrandPinterest className='h-5 w-5 text-red-500' />{' '}
								Pinterest Links
							</DialogTitle>
							<LinksContent showHeader={false} />
						</DialogHeader>
					</DialogContent>
				</Dialog>
			) : (
				// Drawer for mobile
				<Drawer open={isOpen} onOpenChange={setIsOpen}>
					<div className='relative'>
						<div className='relative'>
							<DrawerTrigger asChild>
								<div
									onClick={e => {
										if (quickOpen && links.length > 0) {
											e.preventDefault()
											e.stopPropagation()
											openPinterestLink(links[0].url)
											toast.success(
												`Opening ${links[0].title}...`
											)
											setQuickOpen(false)
										}
									}}
								>
									<TriggerButton />
								</div>
							</DrawerTrigger>
						</div>
					</div>

					<DrawerContent className='bg-black/90 text-white backdrop-blur-md border-t border-white/10 max-w-full'>
						<DrawerHeader className='p-4'>
							<DrawerTitle className='text-xl font-medium text-white/90 flex items-center gap-2 pb-2 truncate'>
								<TbBrandPinterest className='h-5 w-5 text-red-500 flex-shrink-0' />{' '}
								Pinterest Links
							</DrawerTitle>
							<LinksContent showHeader={false} />
						</DrawerHeader>
					</DrawerContent>
				</Drawer>
			)}
		</>
	)
}
