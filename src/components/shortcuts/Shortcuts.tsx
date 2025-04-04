'use client'

import { useState, useRef, useEffect } from 'react'
import { useShortcuts } from '@/context/ShortcutsContext'
import { useColors } from '@/context/ColorsContext'
import { Plus, X, Edit, Check, ExternalLink } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'

// Custom hook for media query
const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false)

	useEffect(() => {
		// Default to true for SSR
		if (typeof window === 'undefined') return

		const media = window.matchMedia(query)
		setMatches(media.matches)

		const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
		media.addEventListener('change', listener)

		return () => media.removeEventListener('change', listener)
	}, [query])

	return matches
}

// Better favicon service
const getFaviconUrl = (url: string) => {
	try {
		const domain = new URL(url).hostname
		return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
	} catch (e) {
		// Log error details
		console.error('Invalid URL for favicon:', url, e)
		return '/placeholder-icon.png' // Fallback icon
	}
}

export default function Shortcuts() {
	const {
		shortcuts,
		addShortcut,
		updateShortcut,
		removeShortcut,
		maxShortcuts,
	} = useShortcuts()
	const { currentColor } = useColors()
	const isDesktop = useMediaQuery('(min-width: 768px)')

	const [isAdding, setIsAdding] = useState(false)
	const [editingId, setEditingId] = useState<string | null>(null)

	const newNameRef = useRef<HTMLInputElement>(null)
	const newUrlRef = useRef<HTMLInputElement>(null)
	const editNameRef = useRef<HTMLInputElement>(null)
	const editUrlRef = useRef<HTMLInputElement>(null)

	// Don't render anything on mobile devices
	if (!isDesktop) {
		return null
	}

	const handleAddSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (newNameRef.current && newUrlRef.current) {
			const name = newNameRef.current.value.trim()
			let url = newUrlRef.current.value.trim()

			// Add https:// if not present
			if (!/^https?:\/\//i.test(url)) {
				url = `https://${url}`
			}

			if (name && url) {
				addShortcut(name, url)
				newNameRef.current.value = ''
				newUrlRef.current.value = ''
				setIsAdding(false)
			}
		}
	}

	const handleEditSubmit = (id: string) => {
		if (editNameRef.current && editUrlRef.current) {
			const name = editNameRef.current.value.trim()
			let url = editUrlRef.current.value.trim()

			// Add https:// if not present
			if (!/^https?:\/\//i.test(url)) {
				url = `https://${url}`
			}

			if (name && url) {
				updateShortcut(id, { name, url })
				setEditingId(null)
			}
		}
	}

	const startEditing = (id: string) => {
		setEditingId(id)
	}

	const cancelEditing = () => {
		setEditingId(null)
	}

	const handleDelete = (id: string) => {
		removeShortcut(id)
	}

	return (
		<div className='w-full max-w-5xl mx-auto my-8 px-4'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-white/90'>
					My Shortcuts
				</h2>

				{shortcuts.length < maxShortcuts && (
					<Dialog open={isAdding} onOpenChange={setIsAdding}>
						<DialogTrigger asChild>
							<button
								className='flex items-center gap-1 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors duration-200'
								style={{ borderColor: `${currentColor}30` }}
							>
								<Plus size={16} />
								<span>Add Shortcut</span>
							</button>
						</DialogTrigger>
						<DialogContent className='bg-black/90 backdrop-blur-sm border overflow-x-hidden border-white/10 text-white max-w-[90vw] md:max-w-[400px] p-4'>
							<DialogHeader className='space-y-1'>
								<DialogTitle className='text-white/90 text-lg font-medium'>
									Add Shortcut
								</DialogTitle>
								<DialogDescription className='text-white/60 text-xs'>
									Create a shortcut to your favorite website
								</DialogDescription>
							</DialogHeader>

							<form onSubmit={handleAddSubmit}>
								<div className='mt-4 grid gap-3 py-2'>
									<div className='flex flex-col gap-1'>
										<label
											htmlFor='name'
											className='text-xs text-white/70'
										>
											Name
										</label>
										<input
											ref={newNameRef}
											id='name'
											type='text'
											placeholder='e.g., Google'
											className='bg-black/30 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30'
											autoFocus
										/>
									</div>
									<div className='flex flex-col gap-1'>
										<label
											htmlFor='url'
											className='text-xs text-white/70'
										>
											URL
										</label>
										<input
											ref={newUrlRef}
											id='url'
											type='text'
											placeholder='e.g., google.com'
											className='bg-black/30 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30'
										/>
									</div>
								</div>
								<div className='mt-4 pt-3 border-t border-white/10 flex justify-end'>
									<button
										type='submit'
										className='text-white/80 text-xs transition-all duration-300 p-1.5 px-3 rounded-lg hover:text-white hover:bg-white/10 active:bg-white/15'
										style={{
											backgroundColor: `${currentColor}30`,
										}}
									>
										Add Shortcut
									</button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				)}
			</div>

			<div className='grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-4'>
				{/* Existing Shortcuts */}
				{shortcuts.map(shortcut => (
					<div
						key={shortcut.id}
						className={`relative group bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col items-center transition-all duration-200 ${
							editingId === shortcut.id ? 'col-span-3' : ''
						}`}
					>
						{editingId === shortcut.id ? (
							// Edit Mode
							<div className='w-full'>
								<div className='flex justify-between items-center mb-3'>
									<h3 className='text-sm font-medium text-white/80'>
										Edit Shortcut
									</h3>
									<button
										onClick={cancelEditing}
										className='text-white/50 hover:text-white/80'
									>
										<X size={16} />
									</button>
								</div>

								<input
									ref={editNameRef}
									type='text'
									defaultValue={shortcut.name}
									className='w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-white/30'
									autoFocus
								/>

								<input
									ref={editUrlRef}
									type='text'
									defaultValue={shortcut.url}
									className='w-full bg-black/30 border border-white/10 rounded-md px-3 py-2 text-sm text-white mb-3 focus:outline-none focus:border-white/30'
								/>

								<button
									onClick={() =>
										handleEditSubmit(shortcut.id)
									}
									className='w-full bg-white/10 hover:bg-white/20 text-white rounded-md py-2 text-sm transition-colors duration-200'
									style={{
										backgroundColor: `${currentColor}30`,
									}}
								>
									<Check size={16} className='inline mr-1' />
									Save
								</button>
							</div>
						) : (
							// View Mode
							<>
								<a
									href={shortcut.url}
									target='_blank'
									rel='noopener noreferrer'
									className='flex flex-col items-center gap-2 hover:scale-105 transition-transform w-full'
								>
									<div className='relative w-12 h-12 bg-white/5 rounded-full flex items-center justify-center overflow-hidden'>
										<Image
											src={getFaviconUrl(shortcut.url)}
											alt={shortcut.name}
											width={32}
											height={32}
											className='object-contain'
											onError={e => {
												// Fallback to first letter if favicon fails
												;(
													e.target as HTMLImageElement
												).style.display = 'none'
												e.currentTarget.parentElement?.setAttribute(
													'data-letter',
													shortcut.name
														.charAt(0)
														.toUpperCase()
												)
												e.currentTarget.parentElement?.classList.add(
													'before:content-[attr(data-letter)]',
													'before:text-lg',
													'before:font-bold',
													'before:text-white'
												)
											}}
										/>
									</div>
									<span className='text-xs text-center text-white/80 line-clamp-1 w-full'>
										{shortcut.name}
									</span>
								</a>

								{/* Edit & Delete buttons - only visible on hover */}
								<div className='absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
									<button
										onClick={() =>
											startEditing(shortcut.id)
										}
										className='bg-black/50 text-white/70 hover:text-white rounded-full p-1.5'
									>
										<Edit size={12} />
									</button>
									<button
										onClick={() =>
											handleDelete(shortcut.id)
										}
										className='bg-black/50 text-white/70 hover:text-red-500 rounded-full p-1.5'
									>
										<X size={12} />
									</button>
								</div>
							</>
						)}
					</div>
				))}

				{/* Empty state when no shortcuts */}
				{shortcuts.length === 0 && (
					<div className='col-span-full flex flex-col items-center justify-center py-10 text-white/50'>
						<ExternalLink
							size={40}
							strokeWidth={1}
							className='mb-2'
						/>
						<p className='text-center'>
							Add shortcuts to your favorite websites.
						</p>

						<Dialog open={isAdding} onOpenChange={setIsAdding}>
							<DialogTrigger asChild>
								<button className='mt-4 px-4 py-2 border border-white/10 rounded-md hover:bg-white/5 transition-colors duration-200'>
									Add Your First Shortcut
								</button>
							</DialogTrigger>
							<DialogContent className='bg-black/90 backdrop-blur-sm border overflow-x-hidden border-white/10 text-white max-w-[90vw] md:max-w-[400px] p-4'>
								<DialogHeader className='space-y-1'>
									<DialogTitle className='text-white/90 text-lg font-medium'>
										Add Shortcut
									</DialogTitle>
									<DialogDescription className='text-white/60 text-xs'>
										Create a shortcut to your favorite
										website
									</DialogDescription>
								</DialogHeader>

								<form onSubmit={handleAddSubmit}>
									<div className='mt-4 grid gap-3 py-2'>
										<div className='flex flex-col gap-1'>
											<label
												htmlFor='name-empty'
												className='text-xs text-white/70'
											>
												Name
											</label>
											<input
												ref={newNameRef}
												id='name-empty'
												type='text'
												placeholder='e.g., Google'
												className='bg-black/30 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30'
												autoFocus
											/>
										</div>
										<div className='flex flex-col gap-1'>
											<label
												htmlFor='url-empty'
												className='text-xs text-white/70'
											>
												URL
											</label>
											<input
												ref={newUrlRef}
												id='url-empty'
												type='text'
												placeholder='e.g., google.com'
												className='bg-black/30 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30'
											/>
										</div>
									</div>
									<div className='mt-4 pt-3 border-t border-white/10 flex justify-end'>
										<button
											type='submit'
											className='text-white/80 text-xs transition-all duration-300 p-1.5 px-3 rounded-lg hover:text-white hover:bg-white/10 active:bg-white/15'
											style={{
												backgroundColor: `${currentColor}30`,
											}}
										>
											Add Shortcut
										</button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				)}
			</div>
		</div>
	)
}
