import { Settings, ChevronDown } from 'lucide-react'
import { PopoverTrigger } from '@/components/ui/popover'

interface PreferencesButtonProps {
	isOpen: boolean
}

export function PreferencesButton({ isOpen }: PreferencesButtonProps) {
	return (
		<PopoverTrigger asChild>
			<button
				type='button'
				className={`text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 flex items-center gap-1.5 md:gap-2 ${
					isOpen
						? 'bg-gradient-to-br from-white/10 to-[#1c34be]/10'
						: ''
				}`}
			>
				<Settings className='h-3 w-3 md:h-5 md:w-5' />
				<span className='text-xs md:text-base'>Preferences</span>
				<ChevronDown className='h-4 w-4 opacity-50' />
			</button>
		</PopoverTrigger>
	)
}
