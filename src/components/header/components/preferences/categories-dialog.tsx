import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface CategoryOption {
	id: string
	name: string
}

const CATEGORIES: CategoryOption[] = [
	{ id: 'age', name: 'Age' },
	{ id: 'athletics', name: 'Athletics' },
	{ id: 'business', name: 'Business' },
	{ id: 'change', name: 'Change' },
	{ id: 'character', name: 'Character' },
	{ id: 'competition', name: 'Competition' },
	{ id: 'conservative', name: 'Conservative' },
	{ id: 'courage', name: 'Courage' },
	{ id: 'creativity', name: 'Creativity' },
	{ id: 'education', name: 'Education' },
	{ id: 'ethics', name: 'Ethics' },
	{ id: 'failure', name: 'Failure' },
	{ id: 'faith', name: 'Faith' },
	{ id: 'family', name: 'Family' },
	{ id: 'famous-quotes', name: 'Famous Quotes' },
	{ id: 'film', name: 'Film' },
	{ id: 'freedom', name: 'Freedom' },
	{ id: 'friendship', name: 'Friendship' },
	{ id: 'future', name: 'Future' },
	{ id: 'generosity', name: 'Generosity' },
	{ id: 'genius', name: 'Genius' },
	{ id: 'gratitude', name: 'Gratitude' },
	{ id: 'happiness', name: 'Happiness' },
	{ id: 'health', name: 'Health' },
	{ id: 'history', name: 'History' },
	{ id: 'honor', name: 'Honor' },
	{ id: 'humor', name: 'Humor' },
	{ id: 'humorous', name: 'Humorous' },
	{ id: 'imagination', name: 'Imagination' },
	{ id: 'inspirational', name: 'Inspirational' },
	{ id: 'knowledge', name: 'Knowledge' },
	{ id: 'leadership', name: 'Leadership' },
	{ id: 'life', name: 'Life' },
	{ id: 'literature', name: 'Literature' },
	{ id: 'love', name: 'Love' },
	{ id: 'mathematics', name: 'Mathematics' },
	{ id: 'motivational', name: 'Motivational' },
	{ id: 'nature', name: 'Nature' },
	{ id: 'opportunity', name: 'Opportunity' },
	{ id: 'pain', name: 'Pain' },
	{ id: 'perseverance', name: 'Perseverance' },
	{ id: 'philosophy', name: 'Philosophy' },
	{ id: 'politics', name: 'Politics' },
	{ id: 'power-quotes', name: 'Power Quotes' },
	{ id: 'proverb', name: 'Proverb' },
	{ id: 'religion', name: 'Religion' },
	{ id: 'sadness', name: 'Sadness' },
	{ id: 'science', name: 'Science' },
	{ id: 'self', name: 'Self' },
	{ id: 'self-help', name: 'Self Help' },
	{ id: 'social-justice', name: 'Social Justice' },
	{ id: 'society', name: 'Society' },
	{ id: 'spirituality', name: 'Spirituality' },
	{ id: 'sports', name: 'Sports' },
	{ id: 'stupidity', name: 'Stupidity' },
	{ id: 'success', name: 'Success' },
	{ id: 'technology', name: 'Technology' },
	{ id: 'time', name: 'Time' },
	{ id: 'tolerance', name: 'Tolerance' },
	{ id: 'truth', name: 'Truth' },
	{ id: 'virtue', name: 'Virtue' },
	{ id: 'war', name: 'War' },
	{ id: 'weakness', name: 'Weakness' },
	{ id: 'wellness', name: 'Wellness' },
	{ id: 'wisdom', name: 'Wisdom' },
	{ id: 'work', name: 'Work' },
]

interface CategoryBadgeProps {
	category: CategoryOption
	onClick: (id: string) => void
	isSelected: boolean
}

function CategoryBadge({ category, onClick, isSelected }: CategoryBadgeProps) {
	return (
		<Badge
			variant={isSelected ? 'default' : 'outline'}
			className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
				isSelected ? 'bg-white/20 text-white' : 'text-white/70'
			}`}
			onClick={() => onClick(category.id)}
		>
			{category.name}
		</Badge>
	)
}

interface CategoriesDialogProps {
	isOpen: boolean
	onOpenChange: (open: boolean) => void
}

export function CategoriesDialog({
	isOpen,
	onOpenChange,
}: CategoriesDialogProps) {
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])

	// Load saved categories from localStorage on component mount
	useEffect(() => {
		const savedCategories = localStorage.getItem('selectedCategories')
		if (savedCategories) {
			setSelectedCategories(JSON.parse(savedCategories))
		}
	}, [])

	const handleCategorySelect = (id: string) => {
		setSelectedCategories(prev => {
			// Check if we're removing the last category
			if (prev.includes(id) && prev.length === 1) {
				// If removing the last category, clear localStorage
				localStorage.removeItem('selectedCategories')
				return []
			} else if (prev.includes(id)) {
				// Normal removal of a category
				const newCategories = prev.filter(catId => catId !== id)
				// Update localStorage immediately
				localStorage.setItem(
					'selectedCategories',
					JSON.stringify(newCategories)
				)
				return newCategories
			} else {
				// Adding a category
				const newCategories = [...prev, id]
				// Update localStorage immediately
				localStorage.setItem(
					'selectedCategories',
					JSON.stringify(newCategories)
				)
				return newCategories
			}
		})
	}

	const handleDeselectAll = () => {
		setSelectedCategories([])
		// Clear localStorage immediately when deselecting all
		localStorage.removeItem('selectedCategories')
	}

	const handleSubmit = () => {
		// Close the dialog
		onOpenChange(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='bg-black/90 backdrop-blur-sm border overflow-x-hidden border-white/10 text-white max-w-[95vw] md:max-w-[800px] p-6'>
				<DialogHeader className='space-y-2'>
					<DialogTitle className='text-white/90 text-xl font-medium'>
						Choose Categories
					</DialogTitle>
					<DialogDescription className='text-white/60'>
						Select categories to customize your quote experience
					</DialogDescription>
					<div className='flex items-center justify-between'>
						<DialogDescription className='text-white/40'>
							If no categories are selected, all categories will
							be used.
						</DialogDescription>
						{selectedCategories.length > 0 && (
							<button
								onClick={handleDeselectAll}
								className='text-white/60 text-xs hover:text-white/80 transition-colors duration-200 ml-4'
							>
								Deselect All
							</button>
						)}
					</div>
				</DialogHeader>

				<div className='mt-6 p-2 flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto overflow-x-hidden pr-4 custom-scrollbar'>
					{CATEGORIES.map(category => (
						<CategoryBadge
							key={category.id}
							category={category}
							onClick={handleCategorySelect}
							isSelected={selectedCategories.includes(
								category.id
							)}
						/>
					))}
				</div>

				<div className='mt-6 pt-4 border-t border-white/10 flex justify-center'>
					<button
						onClick={handleSubmit}
						className={`w-full md:w-[50%] text-center justify-center text-white/80 text-sm transition-all duration-300 p-1.5 rounded-lg hover:text-white hover:bg-white/10 active:bg-white/15`}
					>
						{selectedCategories.length === 0
							? 'Use all categories'
							: `Apply ${selectedCategories.length} ${
									selectedCategories.length === 1
										? 'category'
										: 'categories'
							  }`}
					</button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
