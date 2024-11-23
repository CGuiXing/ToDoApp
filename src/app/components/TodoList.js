"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function TodoList({
  todos, // this should be filtered and paginated todos from useTodos
  deleteTodo,
  updateTodo,
  markComplete,
  paginate,
  currentPage,
  tasksPerPage,
  totalPages,
  handleTasksPerPageChange,
  filteredTodos
}) {
  const [editTodoId, setEditTodoId] = useState(null);
  const [temporaryTodo, setTemporaryTodo] = useState(null);

  console.log("Total Pages:", totalPages);
  console.log("Todos:", todos);
  console.log("Todo Length:", todos.length);
  console.log("Current Page:", currentPage);

  // Handlers for editing, saving, and cancelling todo changes
  const handleEditClick = (todo) => {
    setEditTodoId(todo.id);
    setTemporaryTodo({ ...todo });
  };

  const handleSave = () => {
    updateTodo(editTodoId, temporaryTodo);
    setEditTodoId(null);
    setTemporaryTodo(null);
  };

  const handleCancel = () => {
    setEditTodoId(null);
    setTemporaryTodo(null);
  };

  const handleChange = (e, field) => {
    setTemporaryTodo({ ...temporaryTodo, [field]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setTemporaryTodo({
      ...temporaryTodo,
      completed: e.target.value === "Completed",
    });
  };

  // Export all filtered todos to Excel
  const exportTodos = (filteredTodos) => {
    if (!Array.isArray(filteredTodos)) {
      console.error("filteredTodos is not an array:", filteredTodos);
      return;
    }
  
    const dataToExport = filteredTodos.map((todo) => ({
      Description: todo.description,
      Category: todo.category,
      "Due Date": todo.dueDate,
      Status: todo.completed ? "Completed" : "Incomplete",
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Apply bold style to the headers
    const headerCells = Object.keys(dataToExport[0] || {}).map((key, index) => {
      const colLetter = String.fromCharCode(65 + index); // Convert 0 -> A, 1 -> B, etc.
      return `${colLetter}1`; // Cell reference for the header row (e.g., A1, B1)
    });
  
    headerCells.forEach((cell) => {
      worksheet[cell].s = {
        font: {
          bold: true, // Make the header font bold
        },
      };
    });
  
    // Auto-fit column widths
    const columnWidths = Object.keys(dataToExport[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...dataToExport.map((todo) => (todo[key] || "").toString().length)),
    }));
  
    worksheet["!cols"] = columnWidths; // Apply column width settings
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Todos");
    XLSX.writeFile(workbook, "Todo_Report.xlsx");
  };  

  return (
    <div>
      {/* Export Button */}
      <div style={{ marginBottom: "1em" }} className="text-end">
        <button className="btn btn-primary me-3" onClick={() => exportTodos(filteredTodos)}>
          Export to Excel
        </button>
      </div>

      {/* Todo Table */}
      <table className="table mb-4">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Due Date</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.length > 0 ? (
            todos.map((todo) => (
              <tr key={todo.id}>
                {editTodoId === todo.id ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={temporaryTodo.description}
                        onChange={(e) => handleChange(e, "description")}
                      />
                    </td>
                    <td>
                      <select
                        value={temporaryTodo.category}
                        onChange={(e) => handleChange(e, "category")}
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={temporaryTodo.dueDate}
                        onChange={(e) => handleChange(e, "dueDate")}
                      />
                    </td>
                    <td>
                      <select
                        value={temporaryTodo.completed ? "Completed" : "Incomplete"}
                        onChange={handleStatusChange}
                      >
                        <option value="Completed">Completed</option>
                        <option value="Incomplete">Incomplete</option>
                      </select>
                    </td>
                    <td>
                      <div className="d-flex" style={{ gap: "10px" }}>
                        <button className="btn btn-sm btn-success" onClick={handleSave}>Save</button>
                        <button className="btn btn-sm btn-danger" onClick={handleCancel}>Cancel</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{todo.description}</td>
                    <td>{todo.category}</td>
                    <td>{todo.dueDate}</td>
                    <td>{todo.completed ? "Completed" : "Incomplete"}</td>
                    <td>
                      <div className="d-flex" style={{ gap: "10px" }}>
                        <button className="btn btn-sm btn-success " onClick={() => markComplete(todo.id, !todo.completed)}>
                          Toggle Complete
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteTodo(todo.id)}>Delete</button>
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(todo)}>Edit</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tasks Per Page Dropdown */}
      <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
        <p className="small mb-0 ms-4 me-2 text-muted">Tasks per page:</p>
        <select data-mdb-select-init
          id="tasksPerPage"
          value={tasksPerPage}
          onChange={(e) => handleTasksPerPageChange(Number(e.target.value))}
        >
          {[5, 10, 15, 20].map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      
      {/* Pagination Controls */}
      <div>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          </li>

          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(index + 1)}
                style={{
                  fontWeight: currentPage === index + 1 ? "bold" : "normal",
                }}
              >
                {index + 1}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
        </ul>
      </div>
      <div className="mt-3">
        <p className="text-muted">
          Page <span className="fw-bold">{currentPage}</span> of <span className="fw-bold">{totalPages}</span>
        </p>
      </div>
    </div>
  );
}
