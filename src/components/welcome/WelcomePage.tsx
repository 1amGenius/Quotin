'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import WelcomeCategories from '@/components/welcome/WelcomeCategories'
import WelcomeColors from '@/components/welcome/WelcomeColors'
import SearchEngineSelector from '@/components/welcome/SearchEngineSelector'
import WelcomeIntro from '@/components/welcome/WelcomeIntro'
import { FaGoogle } from 'react-icons/fa'
import {
	TbPalette,
	TbCategory,
	TbBrandYoutube,
	TbCheck,
	TbArrowRight,
	TbSparkles,
	TbBrandPinterest,
} from 'react-icons/tb'
import { motion, AnimatePresence } from 'framer-motion'

// Define steps
const STEPS = [
	{
		id: 'intro',
		label: 'Welcome',
		icon: <TbSparkles className='h-5 w-5' />,
	},
	{
		id: 'categories',
		label: 'Categories',
		icon: <TbCategory className='h-5 w-5' />,
	},
	{ id: 'colors', label: 'Colors', icon: <TbPalette className='h-5 w-5' /> },
	{
		id: 'youtube',
		label: 'Quick Links',
		icon: (
			<div className='flex items-center gap-0.5'>
				<TbBrandYoutube className='h-4 w-4' />
				<TbBrandPinterest className='h-4 w-4' />
			</div>
		),
	},
	{
		id: 'search',
		label: 'Search Engine',
		icon: <FaGoogle className='h-4 w-4' />,
	},
]

// Storage keys
const INTRO_KEY = 'intro_completed'
const CATEGORIES_KEY = 'selectedCategories'
const COLORS_KEY = 'quotin_colors'
const YOUTUBE_KEY = 'youtube-links'
const SEARCH_ENGINE_KEY = 'preferred_search_engine'
const WELCOME_COMPLETED_KEY = 'welcome_completed'

export default function WelcomePage() {
	const [open, setOpen] = useState(false)
	const [currentStep, setCurrentStep] = useState(0)
	const [completedSteps, setCompletedSteps] = useState<string[]>([])
	const [direction, setDirection] = useState(1) // 1 for forward, -1 for backward

	useEffect(() => {
		// Check if welcome has been completed before
		const welcomeCompleted = localStorage.getItem(WELCOME_COMPLETED_KEY)

		if (welcomeCompleted === 'true') {
			return // Skip welcome if already completed
		}

		// Check if any of the settings exist already
		const introCompleted = !!localStorage.getItem(INTRO_KEY)
		const categoriesExist = !!localStorage.getItem(CATEGORIES_KEY)
		const colorsExist = !!localStorage.getItem(COLORS_KEY)
		const youtubeLinksExist = !!localStorage.getItem(YOUTUBE_KEY)
		const searchEngineExists = !!localStorage.getItem(SEARCH_ENGINE_KEY)

		// If any settings exist, mark those steps as completed
		const completed: string[] = []
		if (introCompleted) completed.push('intro')
		if (categoriesExist) completed.push('categories')
		if (colorsExist) completed.push('colors')
		if (youtubeLinksExist) completed.push('youtube')
		if (searchEngineExists) completed.push('search')

		setCompletedSteps(completed)

		// If any settings don't exist, show the welcome dialog
		if (
			!introCompleted ||
			!categoriesExist ||
			!colorsExist ||
			!youtubeLinksExist ||
			!searchEngineExists
		) {
			setOpen(true)

			// Start at the first incomplete step
			if (!introCompleted) setCurrentStep(0)
			else if (!categoriesExist) setCurrentStep(1)
			else if (!colorsExist) setCurrentStep(2)
			else if (!youtubeLinksExist) setCurrentStep(3)
			else if (!searchEngineExists) setCurrentStep(4)
		} else {
			// All settings exist, mark welcome as completed
			localStorage.setItem(WELCOME_COMPLETED_KEY, 'true')
		}
	}, [])

	const handleStepComplete = (stepId: string) => {
		if (!completedSteps.includes(stepId)) {
			setCompletedSteps(prev => [...prev, stepId])
		}

		// Set direction for animation
		setDirection(1)

		// Move to next step or close if done
		if (currentStep < STEPS.length - 1) {
			setCurrentStep(currentStep + 1)
		} else {
			// All steps completed
			localStorage.setItem(WELCOME_COMPLETED_KEY, 'true')
			setOpen(false)
		}
	}

	const currentStepId = STEPS[currentStep]?.id

	// Variants for page transitions
	const pageVariants = {
		enter: (direction: number) => ({
			x: direction > 0 ? 1000 : -1000,
			opacity: 0,
		}),
		center: {
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => ({
			x: direction > 0 ? -1000 : 1000,
			opacity: 0,
		}),
	}

	// Transition for page animations
	const pageTransition = {
		type: 'tween',
		duration: 0.3,
		ease: 'easeInOut',
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='bg-black/90 backdrop-blur-sm border border-white/10 text-white w-[95vw] max-w-[95vw] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[800px] p-4 sm:p-6 h-[90vh] sm:h-auto max-h-[90vh] overflow-y-auto overflow-x-hidden'>
				<DialogTitle className='text-xl sm:text-2xl font-bold text-center mb-2 sm:mb-6'>
					Welcome to Quotin
				</DialogTitle>

				{/* Progress indicators */}
				<div className='flex justify-center mb-4 sm:mb-8'>
					<div className='flex space-x-2 sm:space-x-6'>
						{STEPS.map((step, index) => (
							<div
								key={step.id}
								className='flex flex-col items-center'
							>
								<div
									className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
										completedSteps.includes(step.id)
											? 'bg-white/20 text-white'
											: index === currentStep
											? 'bg-white/10 text-white/70 border border-white/30'
											: 'bg-black/40 text-white/30 border border-white/10'
									}`}
								>
									{completedSteps.includes(step.id) &&
									index < currentStep ? (
										<TbCheck className='h-4 w-4 sm:h-5 sm:w-5' />
									) : (
										<>
											<span className='sm:block hidden'>
												{step.icon}
											</span>
											<span className='block sm:hidden'>
												{step.id === 'intro' ? (
													<TbSparkles className='h-4 w-4' />
												) : step.id === 'categories' ? (
													<TbCategory className='h-4 w-4' />
												) : step.id === 'colors' ? (
													<TbPalette className='h-4 w-4' />
												) : step.id === 'youtube' ? (
													<div className='flex items-center gap-0.5'>
														<TbBrandYoutube className='h-3 w-3' />
														<TbBrandPinterest className='h-3 w-3' />
													</div>
												) : (
													<FaGoogle className='h-3 w-3' />
												)}
											</span>
										</>
									)}
								</div>

								{/* Line under each icon - hidden on small screens */}
								<div
									className={`h-0.5 w-6 sm:w-12 my-1 sm:my-2 ${
										completedSteps.includes(step.id)
											? 'bg-white/20'
											: 'bg-white/5'
									}`}
								/>

								{/* Label - only visible on medium and larger screens */}
								<span className='hidden md:block text-[10px] text-white/60'>
									{step.label}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* Step content with animations */}
				<div className='min-h-[400px] sm:min-h-[450px] md:min-h-[500px] lg:min-h-[550px] relative overflow-visible'>
					<AnimatePresence
						initial={false}
						custom={direction}
						mode='wait'
					>
						<motion.div
							key={currentStepId}
							custom={direction}
							variants={pageVariants}
							initial='enter'
							animate='center'
							exit='exit'
							transition={pageTransition}
							className='w-full h-full'
						>
							{currentStepId === 'intro' && (
								<WelcomeIntro
									onComplete={() =>
										handleStepComplete('intro')
									}
								/>
							)}

							{currentStepId === 'categories' && (
								<WelcomeCategories
									onComplete={() =>
										handleStepComplete('categories')
									}
								/>
							)}

							{currentStepId === 'colors' && (
								<WelcomeColors
									onComplete={() =>
										handleStepComplete('colors')
									}
								/>
							)}

							{currentStepId === 'youtube' && (
								<div className='youtube-step pb-8 sm:pb-12'>
									<h2 className='text-xl sm:text-2xl font-medium text-white/90 mb-2 sm:mb-4'>
										Quick Links
									</h2>
									<p className='text-sm sm:text-base text-white/60 mb-4 sm:mb-6'>
										Add YouTube videos, Pinterest pins, or
										boards for quick access from the
										dashboard.
									</p>
									<div className='youtube-content'>
										{/* We'll use a simpler welcome version */}
										<div className='p-3 sm:p-4 bg-black/20 border border-white/10 rounded-lg'>
											<p className='text-xs sm:text-sm text-white/60 text-center mb-4 sm:mb-6'>
												You can add YouTube videos,
												Pinterest pins, and boards for
												quick access on your dashboard.
											</p>
											<div className='flex justify-center items-center gap-4'>
												<div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 sm:mb-6'>
													<TbBrandYoutube className='h-6 w-6 sm:h-8 sm:w-8 text-red-500' />
												</div>
												<div className='text-white/30 text-xl sm:text-2xl mb-4 sm:mb-6'>
													|
												</div>
												<div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 sm:mb-6'>
													<TbBrandPinterest className='h-6 w-6 sm:h-8 sm:w-8 text-red-500' />
												</div>
											</div>
											<p className='text-xs sm:text-sm text-white/70 text-center'>
												Use the YouTube and Pinterest
												buttons in the bottom left
												corner of your dashboard to add
												content anytime.
											</p>
										</div>
										<div className='mt-4 sm:mt-6 flex justify-end'>
											<button
												className='px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-md bg-white/10 text-white hover:bg-white/20 transition-all flex items-center gap-2 group'
												onClick={() =>
													handleStepComplete(
														'youtube'
													)
												}
											>
												Continue
												<TbArrowRight className='h-3 w-3 sm:h-4 sm:w-4 transform transition-transform group-hover:translate-x-1' />
											</button>
										</div>
									</div>
								</div>
							)}

							{currentStepId === 'search' && (
								<SearchEngineSelector
									onComplete={() =>
										handleStepComplete('search')
									}
								/>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	)
}
