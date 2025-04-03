import { Star } from 'lucide-react'
import { PopoverTrigger } from '@/components/ui/popover'

interface BookmarksButtonProps {
	isOpen: boolean
}

export function BookmarksButton({ isOpen }: BookmarksButtonProps) {
	return (
		<PopoverTrigger asChild>
			<button
				className={`text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 flex items-center gap-1.5 md:gap-2 ${
					isOpen
						? 'bg-gradient-to-br from-white/10 to-[#ffd700]/10'
						: ''
				}`}
			>
				<Star className='h-3 w-3 md:h-5 md:w-5' />
				<span className='text-xs md:text-base'>Bookmarks</span>
			</button>
		</PopoverTrigger>
	)
}
