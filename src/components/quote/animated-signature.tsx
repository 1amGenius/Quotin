'use client'

interface AnimatedSignatureProps {
	name: string
	show: boolean
}

export default function AnimatedSignature({
	show,
	name,
}: AnimatedSignatureProps) {
	const searchName = (name: string) => {
		window.open(`https://www.google.com/search?q=${name}`, '_blank')
	}

	return (
		<div className='flex w-full justify-end'>
			<p
				onClick={() => searchName(name)}
				className={`text-gray-400 font-normal text-sm italic pt-2 cursor-pointer hover:no-underline underline transition-all duration-500 transform ${
					show
						? 'opacity-100 translate-y-0'
						: 'opacity-0 translate-y-4'
				}`}
			>
				{name}
			</p>
		</div>
	)
}
