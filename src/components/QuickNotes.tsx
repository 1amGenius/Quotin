'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Storage key
const NOTES_STORAGE_KEY = 'quick-notes'
const MAX_NOTES_LENGTH = 500

export default function QuickNotes() {
	// Initialize character count when component mounts
	useEffect(() => {
		setTimeout(() => {
			try {
				const textarea = document.getElementById(
					'simple-notes-textarea'
				) as HTMLTextAreaElement
				const countEl = document.getElementById('notes-char-count')

				if (textarea && countEl) {
					const count = textarea.value.length
					countEl.textContent = count.toString()
				}
			} catch (error) {
				console.error('Error initializing notes count:', error)
			}
		}, 100)
	}, [])

	return (
		<div className='flex-1 flex flex-col overflow-hidden p-0'>
			<div className='p-4 flex-1 flex flex-col overflow-hidden'>
				<div className='mb-2 flex justify-between items-center'>
					<label className='text-sm text-white/80'>
						Quick Notes (<span id='notes-char-count'>0</span>/
						{MAX_NOTES_LENGTH})
					</label>
					<Button
						variant='ghost'
						size='sm'
						onClick={() => {
							const textarea = document.getElementById(
								'simple-notes-textarea'
							) as HTMLTextAreaElement
							if (textarea) {
								textarea.value = ''
								localStorage.setItem(NOTES_STORAGE_KEY, '')
								const countEl =
									document.getElementById('notes-char-count')
								if (countEl) countEl.textContent = '0'
								toast.success('Notes cleared')
							}
						}}
						className='h-8 text-white/70 hover:text-white/90 hover:bg-white/10'
					>
						Clear
					</Button>
				</div>

				{/* Absolute simplest approach - plain HTML textarea */}
				<div className='flex-1 relative mb-4 min-h-[200px]'>
					<textarea
						id='simple-notes-textarea'
						className='absolute inset-0 w-full h-full bg-black/50 border border-white/20 text-white p-3 rounded-md resize-none'
						placeholder='Start typing your notes (max 500 characters)...'
						maxLength={MAX_NOTES_LENGTH}
						defaultValue={
							typeof window !== 'undefined'
								? localStorage.getItem(NOTES_STORAGE_KEY) || ''
								: ''
						}
						onInput={e => {
							// Update character count
							const countEl =
								document.getElementById('notes-char-count')
							const count = e.currentTarget.value.length

							if (countEl) countEl.textContent = count.toString()

							// Save to localStorage in real-time
							localStorage.setItem(
								NOTES_STORAGE_KEY,
								e.currentTarget.value
							)
						}}
					></textarea>
				</div>
			</div>

			<div className='border-t border-white/10 bg-black/20 p-3'>
				<p className='text-xs text-white/50 text-center'>
					<span id='notes-char-count-footer'>0</span>/
					{MAX_NOTES_LENGTH} characters used
				</p>
			</div>
		</div>
	)
}
