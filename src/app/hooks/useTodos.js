"use client";

import { useState, useEffect } from 'react';

export function useTodos() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : []; // Parse the saved todos or start with an empty array
  });

  // Sync todos with localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos)); // Save todos to localStorage whenever they change
  }, [todos]); // This effect runs whenever 'todos' changes

  const addTodo = (task) => {
    setTodos((prevTodos) => [...prevTodos, task]);
  };

  // Delete a todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Update a todo (e.g., change description)
  const updateTodo = (id, updatedTask) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, ...updatedTask } : todo));
  };

  // Mark todo as complete or incomplete
  const markComplete = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  return {
    todos,
    addTodo,
    deleteTodo,
    updateTodo,
    markComplete
  };
}
