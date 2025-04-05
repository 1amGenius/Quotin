'use client'

import { useState, useEffect } from 'react'
import { SiGoogle, SiDuckduckgo } from 'react-icons/si'
import { BsBing } from 'react-icons/bs'
import { Button } from '@/components/ui/button'
import { TbArrowRight } from 'react-icons/tb'

// Define the storage key for search engine preference
const STORAGE_KEY = 'preferred_search_engine'

// Define search engines
const searchEngines = [
	{
		name: 'Google',
		url: 'https://www.google.com/search?q=',
		icon: <SiGoogle className='text-white/80' />,
		color: 'from-blue-500 via-red-500 to-yellow-500',
	},
	{
		name: 'Bing',
		url: 'https://www.bing.com/search?q=',
		icon: <BsBing className='text-blue-500' />,
		color: 'from-blue-600 to-blue-400',
	},
	{
		name: 'DuckDuckGo',
		url: 'https://duckduckgo.com/?q=',
		icon: <SiDuckduckgo className='text-orange-500' />,
		color: 'from-orange-600 to-orange-400',
	},
]

interface SearchEngineSelectorProps {
	onComplete: () => void
}

export default function SearchEngineSelector({
	onComplete,
}: SearchEngineSelectorProps) {
	const [selectedEngine, setSelectedEngine] = useState<string | null>(null)

	// Load preferred search engine from localStorage on initial render
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedEngine = localStorage.getItem(STORAGE_KEY)
			if (savedEngine) {
				setSelectedEngine(savedEngine)
			}
		}
	}, [])

	const handleEngineSelect = (engineName: string) => {
		setSelectedEngine(engineName)
		localStorage.setItem(STORAGE_KEY, engineName)

		// Dispatch a custom event to notify other components about the change
		const event = new CustomEvent('search-engine-changed', {
			detail: { engine: engineName },
		})
		window.dispatchEvent(event)
	}

	const handleContinue = () => {
		if (selectedEngine) {
			onComplete()
		}
	}

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h2 className='text-2xl font-medium text-white/90'>
					Choose Your Search Engine
				</h2>
				<p className='text-white/60'>
					Select your preferred search engine to use in the search bar
				</p>
			</div>

			<div className='grid grid-cols-1 gap-4 py-4'>
				{searchEngines.map(engine => (
					<button
						key={engine.name}
						className={`relative flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br ${
							engine.color
						} bg-opacity-10 border border-white/10 transition-all duration-300 hover:shadow-lg overflow-hidden group ${
							selectedEngine === engine.name
								? 'ring-2 ring-white/50 bg-opacity-20'
								: 'hover:bg-opacity-15'
						}`}
						onClick={() => handleEngineSelect(engine.name)}
					>
						<div className='absolute inset-0 bg-black/60 backdrop-blur-sm z-0'></div>
						<div className='relative z-10 flex flex-col items-center gap-3'>
							<div className='text-3xl'>{engine.icon}</div>
							<div className='text-lg font-medium text-white'>
								{engine.name}
							</div>
						</div>
					</button>
				))}
			</div>

			<div className='mt-8 flex justify-end'>
				<Button
					onClick={handleContinue}
					disabled={!selectedEngine}
					className={`px-6 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-all ${
						!selectedEngine ? 'opacity-50 cursor-not-allowed' : ''
					}`}
				>
					Continue
					<TbArrowRight className='h-4 w-4 transform transition-transform group-hover:translate-x-1' />
				</Button>
			</div>
		</div>
	)
}
