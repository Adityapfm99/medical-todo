import React, { useState } from 'react';

const TodoFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    deadline: '',
    assignedUser: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div>
      <h2>Filter To-Dos</h2>
      <input
        type="datetime-local"
        name="deadline"
        value={filters.deadline}
        onChange={handleChange}
      />
      <input
        type="text"
        name="assignedUser"
        placeholder="Assigned User ID"
        value={filters.assignedUser}
        onChange={handleChange}
      />
    </div>
  );
};

export default TodoFilters;
