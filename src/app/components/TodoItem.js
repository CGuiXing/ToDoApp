"use client";

import { useState } from 'react';
import EditTodo from './EditTodo';

export default function TodoItem({ todo, deleteTodo, updateTodo, markComplete }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleComplete = () => {
    markComplete(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <li>
      {isEditing ? (
        <EditTodo
          todo={todo}
          updateTodo={updateTodo}
          cancelEdit={cancelEdit}
        />
      ) : (
        <div>
          <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            {todo.text} - {todo.dueDate}
          </span>
          <button onClick={handleComplete}>
            {todo.completed ? 'Undo' : 'Complete'}
          </button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
    </li>
  );
}
