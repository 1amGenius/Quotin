'use client'

import { useState, useEffect, useCallback } from 'react'
import { TbCheck, TbPlus, TbTrash, TbPencil } from 'react-icons/tb'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Todo interface
interface Todo {
	id: string
	text: string
	completed: boolean
	timestamp: number
}

// Storage key
const TODO_STORAGE_KEY = 'todo-items'

export default function TodoList() {
	// Todo state
	const [todos, setTodos] = useState<Todo[]>([])
	const [editingTodoId, setEditingTodoId] = useState<string | null>(null)
	// Track if todos have been loaded to prevent accidental clearing
	const [todosLoaded, setTodosLoaded] = useState(false)

	// Load todos from localStorage on mount - ONLY ONCE
	useEffect(() => {
		if (typeof window !== 'undefined') {
			try {
				const savedTodos = localStorage.getItem(TODO_STORAGE_KEY)
				if (savedTodos) {
					console.log(
						'Loading todos from localStorage:',
						JSON.parse(savedTodos)
					)
					setTodos(JSON.parse(savedTodos))
				} else {
					console.log(
						'No todos found in localStorage, initializing empty array'
					)
					// Initialize with empty array but don't save it yet
					setTodos([])
				}
				// Mark todos as loaded
				setTodosLoaded(true)
			} catch (error) {
				console.error('Error loading todos:', error)
			}
		}
	}, []) // Empty dependency array - only run once

	// Save todos to localStorage ONLY after they've been loaded and changed
	useEffect(() => {
		// Only save if todos have been loaded from localStorage first
		// This prevents accidentally saving an empty array before loading
		if (todosLoaded && todos !== undefined) {
			try {
				console.log('Saving todos to localStorage:', todos)
				localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
			} catch (error) {
				console.error('Error saving todos to localStorage:', error)
			}
		}
	}, [todos, todosLoaded]) // Only run when todos change AND they've been loaded

	// Todo functions
	const toggleTodo = useCallback((id: string) => {
		setTodos(prev => {
			const newTodos = prev.map(todo =>
				todo.id === id ? { ...todo, completed: !todo.completed } : todo
			)
			return newTodos
		})
	}, [])

	const removeTodo = useCallback((id: string) => {
		setTodos(prev => {
			const newTodos = prev.filter(todo => todo.id !== id)
			return newTodos
		})
		toast.success('Todo removed')
	}, [])

	const startEditingTodo = useCallback((todo: Todo) => {
		setEditingTodoId(todo.id)

		// Set the input value after the component renders
		setTimeout(() => {
			const input = document.getElementById(
				'simple-edit-input'
			) as HTMLInputElement
			if (input) {
				input.value = todo.text
				input.focus()
			}
		}, 0)
	}, [])

	return (
		<div className='flex-1 overflow-auto p-0'>
			<div className='p-4 border-b border-white/10'>
				<div className='flex gap-2'>
					{/* Direct DOM input */}
					<div className='flex-1 relative'>
						<input
							id='simple-todo-input'
							type='text'
							className='w-full h-full bg-black/50 border border-white/20 text-white p-3 rounded-md'
							placeholder='Add a new todo...'
							onKeyDown={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									const input = e.currentTarget
									if (input && input.value.trim()) {
										const newTodoItem: Todo = {
											id: `todo-${Date.now()}`,
											text: input.value.trim(),
											completed: false,
											timestamp: Date.now(),
										}
										setTodos(prev => [...prev, newTodoItem])
										input.value = ''
										toast.success('Todo added')
									}
								}
							}}
						/>
					</div>
					<Button
						onClick={() => {
							const input = document.getElementById(
								'simple-todo-input'
							) as HTMLInputElement
							if (input && input.value.trim()) {
								const newTodoItem: Todo = {
									id: `todo-${Date.now()}`,
									text: input.value.trim(),
									completed: false,
									timestamp: Date.now(),
								}
								setTodos(prev => [...prev, newTodoItem])
								input.value = ''
								toast.success('Todo added')
							}
						}}
						className='bg-emerald-500/80 hover:bg-emerald-500 text-white h-auto'
					>
						<TbPlus className='h-5 w-5' />
					</Button>
				</div>
			</div>

			<div className='p-4 flex-1 overflow-auto'>
				{todos.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-10 text-white/50'>
						<TbCheck className='h-12 w-12 mb-4' />
						<p>No todos yet. Add one above!</p>
					</div>
				) : (
					<ul className='space-y-2'>
						{todos.map(todo => (
							<li
								key={todo.id}
								className='flex items-center gap-2 p-3 rounded-md bg-black/20 border border-white/10'
							>
								{editingTodoId === todo.id ? (
									<div className='flex-1 flex gap-2'>
										{/* Direct DOM input for editing */}
										<input
											id='simple-edit-input'
											type='text'
											className='flex-1 bg-black/50 border-white/20 text-white p-2 rounded-md'
											defaultValue={todo.text}
											autoFocus
											onKeyDown={e => {
												if (e.key === 'Enter') {
													e.preventDefault()
													const input =
														e.currentTarget
													if (input.value.trim()) {
														setTodos(prev =>
															prev.map(t =>
																t.id === todo.id
																	? {
																			...t,
																			text: input.value.trim(),
																	  }
																	: t
															)
														)
														setEditingTodoId(null)
														toast.success(
															'Todo updated'
														)
													}
												} else if (e.key === 'Escape') {
													setEditingTodoId(null)
												}
											}}
										/>
										<Button
											onClick={() => {
												const input =
													document.getElementById(
														'simple-edit-input'
													) as HTMLInputElement
												if (
													input &&
													input.value.trim()
												) {
													setTodos(prev =>
														prev.map(t =>
															t.id === todo.id
																? {
																		...t,
																		text: input.value.trim(),
																  }
																: t
														)
													)
													setEditingTodoId(null)
													toast.success(
														'Todo updated'
													)
												}
											}}
											className='bg-emerald-500/80 hover:bg-emerald-500 text-white'
										>
											Save
										</Button>
									</div>
								) : (
									<>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => toggleTodo(todo.id)}
											className={`rounded-full border h-8 w-8 flex-shrink-0 ${
												todo.completed
													? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
													: 'bg-white/10 border-white/20 text-white'
											}`}
										>
											{todo.completed && (
												<TbCheck className='h-4 w-4' />
											)}
										</Button>

										<span
											className={`flex-1 ${
												todo.completed
													? 'line-through text-white/50'
													: 'text-white'
											}`}
										>
											{todo.text}
										</span>

										<Button
											variant='ghost'
											size='icon'
											onClick={() =>
												startEditingTodo(todo)
											}
											className='bg-white/10 hover:bg-white/20 rounded-full h-8 w-8 group'
										>
											<TbPencil className='h-4 w-4 text-white group-hover:text-sky-400' />
										</Button>

										<Button
											variant='ghost'
											size='icon'
											onClick={() => removeTodo(todo.id)}
											className='bg-white/10 hover:bg-white/20 rounded-full h-8 w-8 group'
										>
											<TbTrash className='h-4 w-4 text-white group-hover:text-red-500' />
										</Button>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</div>

			<div className='border-t border-white/10 bg-black/20 p-3'>
				<p className='text-xs text-white/50 text-center'>
					{`${todos.filter(t => t.completed).length}/${
						todos.length
					} completed`}
				</p>
			</div>
		</div>
	)
}
