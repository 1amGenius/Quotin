'use client'
import { Github, Star, Settings, ExternalLink, ChevronDown } from 'lucide-react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Header() {
	return (
		<header className='fixed top-0 left-0 right-0 z-50 p-4'>
			<div className='max-w-[90vw] md:max-w-[600px] mx-auto'>
				<div className='group bg-white/15 backdrop-blur-[100px] border border-white/20 shadow-sm shadow-white/10 rounded-xl p-3 flex items-center justify-center gap-3 md:gap-20 before:absolute relative'>
					<button className='text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 flex items-center gap-1 md:gap-2'>
						<Github className='h-3 w-3 md:h-5 md:w-5' />
						<span className='text-xs md:text-base'>GitHub</span>
						<ExternalLink className='mb-3 h-3 w-3 md:h-4 md:w-4 opacity-50' />
					</button>

					<button className='text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 flex items-center gap-1.5 md:gap-2'>
						<Star className='h-3 w-3 md:h-5 md:w-5' />
						<span className='text-xs md:text-base'>Bookmarks</span>
					</button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button
								type='button'
								className='text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 flex items-center gap-1.5 md:gap-2'
							>
								<Settings className='h-3 w-3 md:h-5 md:w-5' />
								<span className='text-xs md:text-base'>
									Preferences
								</span>
								<ChevronDown className='h-4 w-4 opacity-50' />
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='w-48 md:w-56'>
							<DropdownMenuItem>Colors</DropdownMenuItem>
							<DropdownMenuItem>Categories</DropdownMenuItem>
							<DropdownMenuItem>Theme</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
