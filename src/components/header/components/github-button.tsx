import { Github, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export function GitHubButton() {
	return (
		<Link
			href='https://github.com/1amGenius/Quotin'
			target='_blank'
			rel='noopener noreferrer'
			className='text-white/80 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10 active:bg-gradient-to-br active:from-white/10 active:to-[#8735f1]/10 flex items-center gap-1 md:gap-2 group/link'
		>
			<Github className='h-3 w-3 md:h-5 md:w-5 transition-colors duration-200' />
			<span className='text-xs md:text-base transition-all duration-300'>
				GitHub
			</span>
			<ExternalLink className='mb-3 h-3 w-3 md:h-4 md:w-4 opacity-50 group-hover/link:opacity-100 transition-opacity duration-200' />
		</Link>
	)
}
