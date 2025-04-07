'use client'

import { useState, useEffect } from 'react'
import { TbNotes } from 'react-icons/tb'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TodoList from '@/components/TodoList'
import QuickNotes from '@/components/QuickNotes'
import { TbListDetails, TbPencil } from 'react-icons/tb'

export default function TodoNotes() {
	const [isOpen, setIsOpen] = useState(false)
	const isDesktop = useMediaQuery('(min-width: 768px)')
	const [activeTab, setActiveTab] = useState('todo')

	// Add keyboard shortcut for opening TodoNotes
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+Q or Command+Q
			if (
				(event.ctrlKey || event.metaKey) &&
				event.key.toLowerCase() === 'q'
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

	// Common trigger button for both modes
	const TriggerButton = ({
		...props
	}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
		<button
			className='h-14 w-14 rounded-full border border-white/30 bg-black/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:border-white/70 hover:scale-105 hover:bg-black/70'
			{...props}
		>
			<TbNotes className='h-6 w-6 text-emerald-400' />
		</button>
	)

	// Common content for both dialog and drawer
	const ContentComponent = () => (
		<div className='flex flex-col h-full overflow-hidden'>
			<Tabs
				defaultValue='todo'
				value={activeTab}
				onValueChange={setActiveTab}
				className='w-full flex-1 flex flex-col overflow-hidden'
			>
				<TabsList className='grid grid-cols-2 bg-black/30'>
					<TabsTrigger
						value='todo'
						className='text-white/70 data-[state=active]:text-white data-[state=active]:bg-black/40'
					>
						<TbListDetails className='h-4 w-4 mr-2' />
						To-Do
					</TabsTrigger>
					<TabsTrigger
						value='notes'
						className='text-white/70 data-[state=active]:text-white data-[state=active]:bg-black/40'
					>
						<TbPencil className='h-4 w-4 mr-2' />
						Quick Notes
					</TabsTrigger>
				</TabsList>

				{/* Todo List Tab */}
				<TabsContent
					value='todo'
					className='flex-1 overflow-hidden flex flex-col m-0'
				>
					<TodoList />
				</TabsContent>

				{/* Notes Tab */}
				<TabsContent
					value='notes'
					className='flex-1 overflow-hidden flex flex-col m-0'
				>
					<QuickNotes />
				</TabsContent>
			</Tabs>
		</div>
	)

	return (
		<>
			{isDesktop ? (
				// Dialog for desktop
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<div className='fixed right-6 bottom-6 z-50'>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<DialogTrigger asChild>
										<TriggerButton />
									</DialogTrigger>
								</TooltipTrigger>
								<TooltipContent className='bg-black/80 text-white border border-white/20'>
									<p>Todo & Notes</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<DialogContent
						className='bg-black/90 text-white backdrop-blur-md border border-white/10 max-w-none w-[70vw] h-[80vh] overflow-hidden flex flex-col !sm:max-w-none'
						style={{ maxWidth: '600px' }}
					>
						<DialogHeader className='p-0 text-left'>
							<DialogTitle className='text-xl font-medium text-white/90 flex items-center gap-2 p-4 pb-2'>
								<TbNotes className='h-5 w-5 text-emerald-400' />{' '}
								{activeTab === 'todo'
									? 'Todo List'
									: 'Quick Notes'}
							</DialogTitle>
						</DialogHeader>
						<ContentComponent />
					</DialogContent>
				</Dialog>
			) : (
				// Drawer for mobile
				<Drawer open={isOpen} onOpenChange={setIsOpen}>
					<div className='fixed right-6 bottom-6 z-50'>
						<DrawerTrigger asChild>
							<TriggerButton />
						</DrawerTrigger>
					</div>

					<DrawerContent className='bg-black/90 text-white backdrop-blur-md border-t border-white/10 max-w-full'>
						<DrawerHeader className='p-4 pb-0'>
							<DrawerTitle className='text-xl font-medium text-white/90 flex items-center gap-2 truncate'>
								<TbNotes className='h-5 w-5 text-emerald-400 flex-shrink-0' />{' '}
								{activeTab === 'todo'
									? 'Todo List'
									: 'Quick Notes'}
							</DrawerTitle>
						</DrawerHeader>
						<ContentComponent />
					</DrawerContent>
				</Drawer>
			)}
		</>
	)
}

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
