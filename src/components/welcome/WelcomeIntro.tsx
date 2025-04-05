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
import { motion } from 'framer-motion'

interface WelcomeIntroProps {
	onComplete: () => void
}

export default function WelcomeIntro({ onComplete }: WelcomeIntroProps) {
	const [isAnimationComplete, setIsAnimationComplete] = useState(false)

	useEffect(() => {
		// Set animation complete after 1 second to show the content
		const timer = setTimeout(() => {
			setIsAnimationComplete(true)
		}, 1000)

		return () => clearTimeout(timer)
	}, [])

	const handleComplete = () => {
		localStorage.setItem('intro_completed', 'true')
		onComplete()
	}

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.8,
			},
		},
	}

	const item = {
		hidden: { y: 20, opacity: 0 },
		show: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 10,
			},
		},
	}

	const floatingAnimation = {
		y: [0, -15, 0],
		transition: {
			duration: 2,
			repeat: Infinity,
			repeatType: 'reverse' as const,
		},
	}

	const rotateAnimation = {
		rotate: [0, 5, 0, -5, 0],
		transition: {
			duration: 5,
			repeat: Infinity,
			ease: 'easeInOut',
		},
	}

	return (
		<div className='relative min-h-[500px] flex flex-col items-center justify-center overflow-hidden'>
			{/* Static bright gradient background */}
			<div
				className='absolute inset-0 z-0 rounded-xl overflow-hidden'
				style={{
					background:
						'linear-gradient(135deg, #00ff6a 0%, #ff00aa 100%)',
					opacity: 0.9,
				}}
			/>

			<div className='absolute inset-0 z-0 backdrop-blur-xl bg-black/10' />

			{/* Initial animation - app logo */}
			<motion.div
				initial={{ scale: 0.5, opacity: 0 }}
				animate={{
					scale: isAnimationComplete ? 0.8 : 1.2,
					opacity: 1,
					y: isAnimationComplete ? -180 : 0,
				}}
				transition={{ duration: 0.8, ease: 'easeOut' }}
				className='relative z-10 mb-6 flex items-center justify-center'
			>
				<div className='bg-white/20 backdrop-blur-md w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border border-white/30'>
					<TbQuote className='text-white w-14 h-14' />
				</div>
			</motion.div>

			{/* Main content - appears after initial animation */}
			{isAnimationComplete && (
				<motion.div
					variants={container}
					initial='hidden'
					animate='show'
					className='relative z-10 text-center space-y-8 px-6'
				>
					<motion.div variants={item}>
						<h1 className='text-4xl font-bold text-white drop-shadow-lg'>
							Welcome to{' '}
							<span className='bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300'>
								Quotin
							</span>
						</h1>
						<p className='mt-4 text-white/80 text-lg max-w-lg mx-auto'>
							Your personal dashboard for inspiration,
							productivity, and discovery.
						</p>
					</motion.div>

					<motion.div
						variants={container}
						className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto'
					>
						<motion.div
							variants={item}
							animate={floatingAnimation}
							className='bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center text-center'
						>
							<TbQuote className='text-white w-8 h-8 mb-2' />
							<p className='text-white/80 text-sm'>
								Discover inspiring quotes
							</p>
						</motion.div>

						<motion.div
							variants={item}
							animate={rotateAnimation}
							className='bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center text-center'
						>
							<TbPalette className='text-white w-8 h-8 mb-2' />
							<p className='text-white/80 text-sm'>
								Customize your colors
							</p>
						</motion.div>

						<motion.div
							variants={item}
							animate={floatingAnimation}
							className='bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center text-center'
						>
							<TbSearch className='text-white w-8 h-8 mb-2' />
							<p className='text-white/80 text-sm'>
								Search with your favorite engine
							</p>
						</motion.div>

						<motion.div
							variants={item}
							animate={rotateAnimation}
							className='bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center text-center'
						>
							<TbNotes className='text-white w-8 h-8 mb-2' />
							<p className='text-white/80 text-sm'>
								Take quick notes and todos
							</p>
						</motion.div>
					</motion.div>

					<motion.div variants={item} className='pt-4'>
						<Button
							onClick={handleComplete}
							className='px-6 py-2 bg-white/20 hover:bg-white/30 text-white group flex items-center gap-2 mx-auto text-lg'
						>
							Get Started
							<TbArrowRight className='h-5 w-5 transform transition-transform group-hover:translate-x-1' />
						</Button>
					</motion.div>
				</motion.div>
			)}

			{/* Animated particles */}
			<AnimatedParticles />
		</div>
	)
}

// Animated particles component
function AnimatedParticles() {
	const particles = Array.from({ length: 20 }, (_, i) => ({
		id: i,
		x: Math.random() * 100,
		y: Math.random() * 100,
		size: Math.random() * 10 + 5,
	}))

	return (
		<div className='absolute inset-0 pointer-events-none overflow-hidden'>
			{particles.map(particle => (
				<motion.div
					key={particle.id}
					className='absolute rounded-full bg-white/30 backdrop-blur-sm'
					style={{
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: `${particle.size}px`,
						height: `${particle.size}px`,
					}}
					animate={{
						x: [0, Math.random() * 50 - 25],
						y: [0, Math.random() * 50 - 25],
					}}
					transition={{
						duration: Math.random() * 5 + 5,
						repeat: Infinity,
						repeatType: 'reverse',
						ease: 'easeInOut',
					}}
				/>
			))}
		</div>
	)
}
