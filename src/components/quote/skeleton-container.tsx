export default function SkeletonContainer() {
	return (
		<div className='relative z-20 flex flex-col items-center justify-center mt-10'>
			<div className='group z-30 bg-black/10 p-6 rounded-2xl backdrop-blur-[100px] border border-white/10 shadow-sm shadow-white/10 relative min-w-[85vw] md:min-w-[800px] max-w-[85vw] md:max-w-[800px] mb-12 md:mb-0 lg:mb-0 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none'>
				<div className='mt-1'>
					<div className='mt-2 pl-4 pb-3 space-y-3'>
						<div className='h-6 sm:h-7 md:h-8 bg-white/5 rounded-lg w-full animate-pulse' />
						<div className='h-6 sm:h-7 md:h-8 bg-white/5 rounded-lg w-full animate-pulse' />
						<div className='h-6 sm:h-7 md:h-8 bg-white/5 rounded-lg w-3/4 animate-pulse' />
					</div>
				</div>

				<div className='flex justify-end mt-3'>
					<div className='h-4 bg-white/5 rounded-lg w-36 animate-pulse' />
				</div>
			</div>
		</div>
	)
}
