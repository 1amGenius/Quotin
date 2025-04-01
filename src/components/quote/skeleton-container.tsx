export default function SkeletonContainer() {
	return (
		<div className='relative z-20 flex flex-col items-center justify-center min-h-screen p-5'>
			<div className='group z-30 bg-black/10 p-8 rounded-2xl backdrop-blur-[100px] border border-white/10 shadow-sm shadow-white/10 relative min-w-[90vw] md:min-w-[900px] max-w-[90vw] md:max-w-[900px] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none'>
				{/* Main Text Area Skeleton */}
				<div className='min-h-[120px] md:min-h-[150px] mt-3 pl-5 pb-5'>
					<div className='space-y-4'>
						<div className='h-8 bg-white/5 rounded-lg w-full animate-pulse' />
						<div className='h-8 bg-white/5 rounded-lg w-full animate-pulse' />
						<div className='h-8 bg-white/5 rounded-lg w-full animate-pulse' />
						<div className='h-8 bg-white/5 rounded-lg w-3/4 animate-pulse md:hidden' />
					</div>
				</div>

				{/* Signature Skeleton */}
				<div className='flex justify-end mt-4'>
					<div className='h-6 bg-white/5 rounded-lg w-48 animate-pulse' />
				</div>
			</div>
		</div>
	)
}
