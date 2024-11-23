import React from 'react';

export default function Filters({
  setSearchKeyword,
  setStatusFilter,
  setCategoryFilter,
  setSortOrder
}) {
  const categories = ["Work", "Personal", "Urgent"];

  return (
    <div>
      <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3">
        {/* Search Bar */}
        <p className="small mb-0 me-2 text-muted">Description:</p>
        <input
          type="text"
          placeholder="Search by description..."
          onChange={(e) => setSearchKeyword(e.target.value)}
        />

        {/* Status Dropdown */}
        <p className="small mb-0 ms-4 me-2 text-muted">Status:</p>
        <select data-mdb-select-init id="statusFilter" onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>

        {/* Category Dropdown */}
        <p className="small mb-0 ms-4 me-2 text-muted">Category:</p>
        <select data-mdb-select-init id="categoryFilter" onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Sorting Dropdown */}
        <p className="small mb-0 ms-4 me-2 text-muted">Sort by Due Date:</p>
        <select data-mdb-select-init id="sortOrder" onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
