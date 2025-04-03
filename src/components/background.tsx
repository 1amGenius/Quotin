'use client'
import { useColors } from '@/context/ColorsContext'

export default function Background({
	children,
}: {
	children: React.ReactNode
}) {
	const { currentColor } = useColors()

	return (
		<div
			className='min-h-screen min-w-screen z-0 w-full relative overflow-hidden transition-all duration-300'
			style={{
				background: `linear-gradient(to bottom right, black, black, ${
					currentColor || '#1a1a1a'
				})`,
			}}
		>
			{children}
		</div>
	)
}
