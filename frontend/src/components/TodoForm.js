import React, { useState } from 'react';
import { createTodo } from '../services/api';

const TodoForm = ({ onTodoCreated }) => {
  const [formData, setFormData] = useState({
    task: '',
    deadline: '',
    assigned_users: [],
    resources: [],
  });

  const handleChange = (e) => {
    console.log("Selected User ID:", e.target.value);
    setAssignedUser(e.target.value);
  };
  
  <Select
    value={assignedUser}
    onChange={handleChange}
  >
    {/* Options */}
  </Select>

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTodo(formData);
      onTodoCreated();
      setFormData({
        task: '',
        deadline: '',
        assigned_users: [],
        resources: [],
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create To-Dso</h2>
      <input
        type="text"
        name="task"
        placeholder="Task Name"
        value={formData.task}
        onChange={handleChange}
        required
      />
      <input
        type="datetime-local"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="assigned_users"
        placeholder="Assigned Users (comma-separated)"
        value={formData.assigned_users}
        onChange={(e) => setFormData({ ...formData, assigned_users: e.target.value.split(',') })}
      />
      <input
        type="text"
        name="resources"
        placeholder="Resource URLs (comma-separated)"
        value={formData.resources}
        onChange={(e) => setFormData({ ...formData, resources: e.target.value.split(',') })}
      />
      <button type="submit">Create</button>
    </form>
  );
};

export default TodoForm;
