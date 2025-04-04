import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from '@/components/ui/dialog'
import { useColors } from '@/context/ColorsContext'
import { X } from 'lucide-react'

interface ColorOption {
	hex: string
	name: string
}

const COLORS: ColorOption[] = [
	{ hex: '#1a1a1a', name: 'Dark Gray' },
	{ hex: '#000080', name: 'Navy' },
	{ hex: '#4B0082', name: 'Indigo' },
	{ hex: '#800080', name: 'Purple' },
	{ hex: '#702963', name: 'Byzantium' },
	{ hex: '#4A0404', name: 'Dark Burgundy' },
	{ hex: '#800000', name: 'Maroon' },
	{ hex: '#654321', name: 'Dark Brown' },
	{ hex: '#2F4F4F', name: 'Dark Slate Gray' },
	{ hex: '#008080', name: 'Teal' },
	{ hex: '#004225', name: 'British Racing Green' },
	{ hex: '#006400', name: 'Dark Green' },
	{ hex: '#004953', name: 'Midnight Green' },
	{ hex: '#151515', name: 'Onyx' },
	{ hex: '#000000', name: 'Black' },
	{ hex: '#FF4500', name: 'Orange Red' },
	{ hex: '#FFD700', name: 'Gold' },
	{ hex: '#98FF98', name: 'Mint Green' },
	{ hex: '#E6E6FA', name: 'Lavender' },
	{ hex: '#FF69B4', name: 'Hot Pink' },
	{ hex: '#40E0D0', name: 'Turquoise' },
	{ hex: '#FF8C00', name: 'Dark Orange' },
	{ hex: '#FF1493', name: 'Deep Pink' },
	{ hex: '#7FFFD4', name: 'Aquamarine' },
	{ hex: '#BA55D3', name: 'Medium Orchid' },
	{ hex: '#FF7F50', name: 'Coral' },
	{ hex: '#00FF7F', name: 'Spring Green' },
	{ hex: '#9370DB', name: 'Medium Purple' },
	{ hex: '#F0E68C', name: 'Khaki' },
	{ hex: '#87CEEB', name: 'Sky Blue' },
	{ hex: '#DDA0DD', name: 'Plum' },
	{ hex: '#98FB98', name: 'Pale Green' },
	{ hex: '#DEB887', name: 'Burlywood' },
	{ hex: '#FF00FF', name: 'Magenta' },
	{ hex: '#F4A460', name: 'Sandy Brown' },
	{ hex: '#6495ED', name: 'Cornflower Blue' },
	{ hex: '#DC143C', name: 'Crimson' },
	{ hex: '#FF6347', name: 'Tomato' },
	{ hex: '#4169E1', name: 'Royal Blue' },
	{ hex: '#32CD32', name: 'Lime Green' },
	{ hex: '#FF0000', name: 'Red' },
	{ hex: '#FFA500', name: 'Orange' },
	{ hex: '#FFFF00', name: 'Yellow' },
	{ hex: '#00FF00', name: 'Lime' },
	{ hex: '#00FFFF', name: 'Cyan' },
	{ hex: '#C3B091', name: 'Khaki Grey' },
]

interface ColorPillProps {
	color: string
	onClick: (hex: string) => void
	isSelected: boolean
}

export function ColorPill({ color, onClick, isSelected }: ColorPillProps) {
	return (
		<button
			onClick={() => onClick(color)}
			className={`group relative flex items-center w-full rounded-full transition-all duration-300 hover:scale-[1.02] ${
				isSelected
					? 'ring-2 ring-white/40 ring-offset-1 ring-offset-black/90'
					: ''
			}`}
		>
			<div className='w-24 h-16 rounded-l-full border border-white/10 overflow-hidden'>
				<div
					className='w-full h-full transition-all duration-300'
					style={{
						background: `linear-gradient(to bottom right, #000000, #000000, ${color})`,
					}}
				/>
			</div>
			<div className='flex-1 bg-black/40 backdrop-blur-sm px-4 h-16 flex items-center justify-between rounded-r-full border-l border-white/10'>
				<span className='text-white/80 text-sm font-mono group-hover:text-white transition-colors'>
					{color}
				</span>
				{isSelected && (
					<span className='text-white/35 text-xs'>Selected</span>
				)}
			</div>
		</button>
	)
}

interface ColorsDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}

export function ColorsDialog({
	isOpen,
	onOpenChange,
}: Omit<ColorsDialogProps, 'selectedColors' | 'onColorSelect'>) {
	const {
		colors: selectedColors,
		setColors,
		addColor,
		removeColor,
	} = useColors()

	const handleColorSelect = (hex: string) => {
		z
		if (selectedColors.includes(hex)) {
			removeColor(hex)
		} else {
			addColor(hex)
		}
	}

	const handleDeselectAll = () => {
		setColors([])
	}

	const handleSubmit = () => {
		// Colors are already saved in localStorage through the context
		onOpenChange(false) // Close the dialog
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='bg-black/90 backdrop-blur-sm border overflow-x-hidden border-white/10 text-white max-w-[95vw] md:max-w-[800px] p-6'>
				<DialogClose className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'>
					<X className='h-4 w-4 text-white' />
					<span className='sr-only'>Close</span>
				</DialogClose>

				<DialogHeader className='space-y-2'>
					<DialogTitle className='text-white/90 text-xl font-medium'>
						Choose Colors
					</DialogTitle>
					<div className='flex items-center justify-between'>
						<DialogDescription className='text-white/60'>
							Select multiple colors to create your custom
							gradient background
						</DialogDescription>
						{selectedColors.length > 0 && (
							<button
								onClick={handleDeselectAll}
								className='text-white/60 text-xs hover:text-white/80 transition-colors duration-200 ml-4'
							>
								Deselect All
							</button>
						)}
					</div>
				</DialogHeader>

				<div className='mt-6 p-2 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar'>
					{COLORS.map(color => (
						<ColorPill
							key={color.hex}
							color={color.hex}
							onClick={handleColorSelect}
							isSelected={selectedColors.includes(color.hex)}
						/>
					))}
				</div>

				<div className='mt-6 pt-4 border-t border-white/10 flex justify-center'>
					<button
						onClick={handleSubmit}
						disabled={selectedColors.length === 0}
						className={`w-full md:w-[50%] text-center justify-center text-white/80 text-sm transition-all duration-300 p-1.5 rounded-lg
							${
								selectedColors.length > 0
									? 'hover:text-white hover:bg-white/10 active:bg-white/15'
									: 'opacity-50 cursor-not-allowed'
							}
						`}
					>
						{selectedColors.length === 0
							? 'Select at least one color'
							: `Apply ${selectedColors.length} color${
									selectedColors.length > 1 ? 's' : ''
							  }`}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
