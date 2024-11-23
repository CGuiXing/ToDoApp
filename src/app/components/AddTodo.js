import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function AddTodo({ addTodo }) {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('Personal'); // Default category

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !dueDate) return; // Prevent empty tasks

    const newTodo = {
      id: Math.random().toString(36).substr(2, 9),
      description,
      dueDate,
      category,
      completed: false,
    };
    addTodo(newTodo);
    setDescription('');
    setDueDate('');
    setCategory('Personal');
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const ab = event.target.result;
      const workbook = XLSX.read(ab, { type: 'array' });
  
      // Get the first sheet
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
      // Convert sheet data to JSON
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      // The first row is the header, so start from the second row (index 1)
      const tasks = data.slice(1);
  
      // Accumulate all tasks in an array
      const newTasks = tasks.map((task) => {
        const [description, dueDate, category] = task;
        if (description && dueDate) {
          return {
            id: Math.random().toString(36).substr(2, 9),
            description,
            dueDate,
            category: category || 'Personal',
            completed: false,
          };
        }
        return null; // Skip invalid rows
      }).filter(Boolean); // Filter out any null values

      console.log(newTasks);
  
      // Add all tasks at once to avoid state batching issues
      if (newTasks.length > 0) {
        newTasks.forEach((newTask) => {
          addTodo(newTask);  // Add each task individually after filtering
        });
      }
    };
  
    reader.readAsArrayBuffer(file);
  
    // Reset the input field to allow the same file to be uploaded again
    e.target.value = '';  // This resets the file input
  };
  

  return (
    <div>
      <div className="pb-2">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-row align-items-center">
              <form onSubmit={handleSubmit} className="w-100 d-flex align-items-center space-x-3">
                <div className="form-group me-3 flex-grow-1">
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderColor: '#6c757d' }}
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group me-3">
                  <input
                    type="date"
                    className="form-control"
                    style={{ borderColor: '#6c757d' }}
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group me-3">
                  <div className="custom-select-wrapper position-relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="form-control"
                      style={{
                        borderColor: '#6c757d',
                        appearance: 'none', // Remove default dropdown arrow
                        paddingRight: '30px', // Space for the icon
                      }}
                    >
                      <option value="Personal">Personal</option>
                      <option value="Work">Work</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    <i
                      className="fas fa-chevron-down position-absolute"
                      style={{
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none', // Make sure the icon does not block interaction with the select
                      }}
                    ></i>
                  </div>
                </div>
                <div className="form-group me-3">
                  <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary">Add</button>
                </div>
              </form>
            </div>
            
            {/* Excel file import */}
            <div className="mt-4">
              <div className="d-flex align-items-center">
                <p className="mb-0 me-3 fw-bold">Import Tasks from Excel:</p>
                <a href="/todo_template.xlsx" download>
                  <button className="btn btn-secondary me-3">Download Template</button>
                </a>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileImport}
                  className="form-control"
                  style={{ borderColor: '#6c757d' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
