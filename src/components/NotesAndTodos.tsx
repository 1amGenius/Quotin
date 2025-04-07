'use client'

import { useState, useEffect } from 'react'
import { TbNotes, TbPlus, TbTrash, TbCheck } from 'react-icons/tb'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// Interface for Note
interface Note {
	id: string
	text: string
	timestamp: number
}

// Interface for Todo
interface Todo {
	id: string
	text: string
	completed: boolean
	timestamp: number
}

// Storage keys
const NOTES_KEY = 'notes'
const TODOS_KEY = 'todos'

export default function NotesAndTodos() {
	const [isOpen, setIsOpen] = useState(false)
	const [notes, setNotes] = useState<Note[]>([])
	const [todos, setTodos] = useState<Todo[]>([])
	const [newNote, setNewNote] = useState('')
	const [newTodo, setNewTodo] = useState('')
	const [activeTab, setActiveTab] = useState<'notes' | 'todos'>('notes')

	// Add keyboard shortcut for opening Notes & Todos
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Check for Ctrl+Q or Command+Q
			if (
				(event.ctrlKey || event.metaKey) &&
				event.key.toLowerCase() === 'q'
			) {
				event.preventDefault() // Prevent default browser behavior
				setIsOpen(true)
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [])

	// Load notes and todos from local storage
	useEffect(() => {
		const loadData = () => {
			try {
				const savedNotes = localStorage.getItem(NOTES_KEY)
				const savedTodos = localStorage.getItem(TODOS_KEY)

				if (savedNotes) {
					setNotes(JSON.parse(savedNotes))
				}

				if (savedTodos) {
					setTodos(JSON.parse(savedTodos))
				}
			} catch (error) {
				console.error('Error loading notes and todos:', error)
			}
		}

		if (typeof window !== 'undefined') {
			loadData()
		}
	}, [])

	// Save notes and todos to local storage
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (notes.length > 0) {
				localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
			}

			if (todos.length > 0) {
				localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
			}
		}
	}, [notes, todos])

	// Add a new note
	const addNote = () => {
		if (newNote.trim()) {
			const note: Note = {
				id: `note-${Date.now()}`,
				text: newNote.trim(),
				timestamp: Date.now(),
			}

			setNotes(prev => [note, ...prev])
			setNewNote('')
			toast.success('Note added successfully')
		}
	}

	// Remove a note
	const removeNote = (id: string) => {
		setNotes(prev => prev.filter(note => note.id !== id))
		toast.success('Note removed successfully')
	}

	// Add a new todo
	const addTodo = () => {
		if (newTodo.trim()) {
			const todo: Todo = {
				id: `todo-${Date.now()}`,
				text: newTodo.trim(),
				completed: false,
				timestamp: Date.now(),
			}

			setTodos(prev => [todo, ...prev])
			setNewTodo('')
			toast.success('Todo added successfully')
		}
	}

	// Toggle todo completion
	const toggleTodo = (id: string) => {
		setTodos(prev =>
			prev.map(todo =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
		)
	}

	// Remove a todo
	const removeTodo = (id: string) => {
		setTodos(prev => prev.filter(todo => todo.id !== id))
		toast.success('Todo removed successfully')
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className='bg-black/90 text-white backdrop-blur-md border border-white/10 max-w-none w-[90vw] sm:w-[600px] h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle className='text-xl font-medium text-white/90 flex items-center gap-2'>
						<TbNotes className='h-5 w-5 text-blue-500' /> Notes &
						Todos
					</DialogTitle>
				</DialogHeader>

				<div className='flex border-b border-white/10 mb-4'>
					<button
						className={`px-4 py-2 text-sm font-medium ${
							activeTab === 'notes'
								? 'text-white border-b-2 border-blue-500'
								: 'text-white/60 hover:text-white/80'
						}`}
						onClick={() => setActiveTab('notes')}
					>
						Notes
					</button>
					<button
						className={`px-4 py-2 text-sm font-medium ${
							activeTab === 'todos'
								? 'text-white border-b-2 border-blue-500'
								: 'text-white/60 hover:text-white/80'
						}`}
						onClick={() => setActiveTab('todos')}
					>
						Todos
					</button>
				</div>

				{activeTab === 'notes' ? (
					<div className='space-y-4'>
						<div className='flex gap-2'>
							<Input
								placeholder='Add a new note...'
								value={newNote}
								onChange={e => setNewNote(e.target.value)}
								className='bg-black/50 border-white/20 text-white placeholder:text-white/40 flex-1'
								onKeyDown={e => {
									if (e.key === 'Enter') {
										addNote()
									}
								}}
							/>
							<Button
								onClick={addNote}
								className='bg-blue-500 hover:bg-blue-600 text-white'
							>
								<TbPlus className='h-4 w-4' />
							</Button>
						</div>

						{notes.length === 0 ? (
							<div className='text-center py-8 text-white/50'>
								<p>No notes yet. Add your first note!</p>
							</div>
						) : (
							<div className='space-y-2'>
								{notes.map(note => (
									<div
										key={note.id}
										className='p-3 bg-black/30 border border-white/10 rounded-lg flex items-start justify-between'
									>
										<p className='text-white/90'>
											{note.text}
										</p>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => removeNote(note.id)}
											className='h-8 w-8 text-white/60 hover:text-white hover:bg-white/10'
										>
											<TbTrash className='h-4 w-4' />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				) : (
					<div className='space-y-4'>
						<div className='flex gap-2'>
							<Input
								placeholder='Add a new todo...'
								value={newTodo}
								onChange={e => setNewTodo(e.target.value)}
								className='bg-black/50 border-white/20 text-white placeholder:text-white/40 flex-1'
								onKeyDown={e => {
									if (e.key === 'Enter') {
										addTodo()
									}
								}}
							/>
							<Button
								onClick={addTodo}
								className='bg-blue-500 hover:bg-blue-600 text-white'
							>
								<TbPlus className='h-4 w-4' />
							</Button>
						</div>

						{todos.length === 0 ? (
							<div className='text-center py-8 text-white/50'>
								<p>No todos yet. Add your first todo!</p>
							</div>
						) : (
							<div className='space-y-2'>
								{todos.map(todo => (
									<div
										key={todo.id}
										className='p-3 bg-black/30 border border-white/10 rounded-lg flex items-center justify-between'
									>
										<div className='flex items-center gap-2'>
											<button
												onClick={() =>
													toggleTodo(todo.id)
												}
												className={`h-5 w-5 rounded-full border ${
													todo.completed
														? 'bg-green-500 border-green-500'
														: 'border-white/30'
												} flex items-center justify-center`}
											>
												{todo.completed && (
													<TbCheck className='h-3 w-3 text-white' />
												)}
											</button>
											<p
												className={`text-white/90 ${
													todo.completed
														? 'line-through text-white/50'
														: ''
												}`}
											>
												{todo.text}
											</p>
										</div>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => removeTodo(todo.id)}
											className='h-8 w-8 text-white/60 hover:text-white hover:bg-white/10'
										>
											<TbTrash className='h-4 w-4' />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
