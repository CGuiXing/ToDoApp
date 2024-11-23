"use client";

import { useState } from 'react';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import Filters from './components/Filters';
import { useTodos } from './hooks/useTodos';

export default function App() {
  const { todos, addTodo, deleteTodo, updateTodo, markComplete } = useTodos();
  const [searchKeyword, setSearchKeyword] = useState("");   // Search keyword
  const [statusFilter, setStatusFilter] = useState("all");  // Status filter (all, completed, incomplete)
  const [categoryFilter, setCategoryFilter] = useState("all"); // Category filter (all, work, personal, urgent)
  const [sortOrder, setSortOrder] = useState("asc");         // Sort order (asc, desc)
  const [tasksPerPage, setTasksPerPage] = useState(5); // Default tasks per page
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter function that modifies the state of todos based on filters
  const filterTodos = (todos) => {
    let filtered = [...todos];
    
    // Filter by search keyword
    if (searchKeyword) {
      filtered = filtered.filter(todo => todo.description.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(todo => todo.completed === (statusFilter === "completed"));
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(todo => todo.category === categoryFilter);
    }

    // Sort by due date
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  };

  const filteredTodos = filterTodos(todos || []);  // Apply the filters to todos
  const totalPages = Math.ceil(filteredTodos.length / tasksPerPage) || 1;

  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }

  const paginate = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const paginatedTodos = filteredTodos.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const handleTasksPerPageChange = (value) => {
    setTasksPerPage(value);
    setCurrentPage(1); // Reset to the first page when tasks per page changes
  };

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card" id="list1" style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}>
              <div className="card-body py-4 px-4 px-md-5">
                <p className="h1 text-center mt-3 mb-4 pb-3 text-primary">
                  <i className="fas fa-check-square me-1"></i>
                  <u>To-Do List App</u>
                </p>
                <AddTodo addTodo={addTodo} />
                <hr className="my-4"></hr>
                <Filters 
                  setSearchKeyword={setSearchKeyword}
                  setStatusFilter={setStatusFilter}
                  setCategoryFilter={setCategoryFilter}
                  setSortOrder={setSortOrder}
                />
                <div>
                  <TodoList
                    todos={paginatedTodos} // Ensure filtering is applied before pagination
                    deleteTodo={deleteTodo}
                    updateTodo={updateTodo}
                    markComplete={markComplete}
                    paginate={paginate}
                    currentPage={currentPage}
                    tasksPerPage={tasksPerPage}
                    totalPages={totalPages}
                    handleTasksPerPageChange={handleTasksPerPageChange}
                    filteredTodos={filteredTodos}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
