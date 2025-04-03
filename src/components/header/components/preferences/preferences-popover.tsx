import { PopoverContent } from '@/components/ui/popover'
import { ColorsDialog } from './colors-dialog'
import { CategoriesDialog } from './categories-dialog'

interface PreferenceItemProps {
	label: string
	onClick: () => void
}

function PreferenceItem({ label, onClick }: PreferenceItemProps) {
	return (
		<div className='group/pref relative'>
			<button
				onClick={onClick}
				className='w-full text-center text-white/80 text-sm hover:text-white transition-all duration-300 p-1.5 rounded-xl hover:bg-white/10'
			>
				{label}
			</button>
		</div>
	)
}

interface PreferencesPopoverProps {
	onCategoriesClick: () => void
	onColorsClick: () => void
	isColorsDialogOpen: boolean
	onColorsDialogOpenChange: (open: boolean) => void
	isCategoriesDialogOpen: boolean
	onCategoriesDialogOpenChange: (open: boolean) => void
}

export function PreferencesPopover({
	onCategoriesClick,
	onColorsClick,
	isColorsDialogOpen,
	onColorsDialogOpenChange,
	isCategoriesDialogOpen,
	onCategoriesDialogOpenChange,
}: PreferencesPopoverProps) {
	return (
		<>
			<PopoverContent className='w-40 bg-black/10 backdrop-blur-sm border border-white/10'>
				<div className='space-y-3'>
					<PreferenceItem
						label='Categories'
						onClick={onCategoriesClick}
					/>
					<PreferenceItem label='Colors' onClick={onColorsClick} />
				</div>
			</PopoverContent>

			<ColorsDialog
				isOpen={isColorsDialogOpen}
				onOpenChange={onColorsDialogOpenChange}
			/>

			<CategoriesDialog
				isOpen={isCategoriesDialogOpen}
				onOpenChange={onCategoriesDialogOpenChange}
			/>
		</>
	)
}
