'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
	TbArrowRight,
	TbQuote,
	TbPalette,
	TbSearch,
	TbNotes,
} from 'react-icons/tb'

interface WelcomeIntroProps {
	onComplete: () => void
}

export default function WelcomeIntro({ onComplete }: WelcomeIntroProps) {
	const [isAnimationComplete, setIsAnimationComplete] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsAnimationComplete(true), 1000)
		return () => clearTimeout(timer)
	}, [])

	const handleComplete = () => {
		localStorage.setItem('intro_completed', 'true')
		onComplete()
	}

	return (
		<div className='relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden'>
			{/* Background with blurred gradient */}
			<div className='absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent' />
			<div className='absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-transparent blur-3xl' />
			<div className='absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-transparent to-transparent blur-3xl' />

			{/* Logo */}
			<div
				className={`relative z-10 mb-6 flex items-center justify-center ${
					isAnimationComplete ? 'move-up' : ''
				}`}
				style={{
					transform: isAnimationComplete
						? 'translateY(-20px)'
						: 'translateY(0)',
					transition: 'transform 0.5s ease-out',
				}}
			>
				<div className='bg-white/5 backdrop-blur-md w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 hover:border-white/20 transition-all duration-300'>
					<TbQuote className='text-white/90 w-14 h-14 hover:text-white transition-colors duration-300' />
				</div>
			</div>

			{/* Content */}
			{isAnimationComplete && (
				<div className='relative z-10 text-center space-y-8 px-6 fade-in'>
					<div>
						<h1 className='text-4xl font-bold text-white drop-shadow-lg'>
							Welcome to{' '}
							<span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600'>
								Quotin
							</span>
						</h1>
						<p className='mt-4 text-white/80 text-lg max-w-lg mx-auto'>
							Your personal dashboard for inspiration,
							productivity, and discovery.
						</p>
					</div>

					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto'>
						<div className='bg-white/5 p-4 rounded-xl border border-white/10 text-white text-sm fade-in hover:border-white/20 transition-all duration-300'>
							<TbQuote className='w-8 h-8 mb-2' />
							Discover inspiring quotes
						</div>
						<div className='bg-white/5 p-4 rounded-xl border border-white/10 text-white text-sm fade-in hover:border-white/20 transition-all duration-300'>
							<TbPalette className='w-8 h-8 mb-2' />
							Customize your colors
						</div>
						<div className='bg-white/5 p-4 rounded-xl border border-white/10 text-white text-sm fade-in hover:border-white/20 transition-all duration-300'>
							<TbSearch className='w-8 h-8 mb-2' />
							Search with your favorite engine
						</div>
						<div className='bg-white/5 p-4 rounded-xl border border-white/10 text-white text-sm fade-in hover:border-white/20 transition-all duration-300'>
							<TbNotes className='w-8 h-8 mb-2' />
							Take quick notes and todos
						</div>
					</div>

					<div>
						<Button
							onClick={handleComplete}
							className='px-6 py-2 bg-white/5 hover:bg-white/10 text-white group flex items-center gap-2 mx-auto text-lg fade-in border border-white/10 hover:border-white/20 transition-all duration-300'
						>
							Get Started
							<TbArrowRight className='h-5 w-5 transform transition-transform group-hover:translate-x-1' />
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
