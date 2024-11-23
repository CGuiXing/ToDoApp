import { useState } from 'react';

export default function EditTodo({ todo, onSave, onCancel }) {
  const [description, setDescription] = useState(todo.description);
  const [category, setCategory] = useState(todo.category);
  const [dueDate, setDueDate] = useState(todo.dueDate);
  const [completed, setCompleted] = useState(todo.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTodo = {
      ...todo,
      description,
      category,
      dueDate,
      completed,
    };
    onSave(updatedTodo); // Save the updated todo
  };

  return (
    <div>
      <h2>Edit Todo</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            value={completed ? 'Completed' : 'Incomplete'}
            onChange={(e) => setCompleted(e.target.value === 'Completed')}
          >
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
          </select>
        </div>
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
