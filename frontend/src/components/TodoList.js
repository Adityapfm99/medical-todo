import React, { useEffect, useState } from "react";
import { getTodos, updateTodo } from "../services/api";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState({ task_name: "", deadline_from: "", deadline_to: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editForm, setEditForm] = useState({ task: "", deadline: "", assigned_users: [], resources: "" });
  const [users] = useState([]);

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const fetchAllTodos = async () => {
    setLoading(true);
    try {
      const response = await getTodos();
      setTodos(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    const params = new URLSearchParams();
    if (filters.task_name) params.append("task_name", filters.task_name);
    if (filters.deadline_from) params.append("deadline_from", filters.deadline_from);
    if (filters.deadline_to) params.append("deadline_to", filters.deadline_to);

    try {
      const response = await fetch(`http://localhost:3000/api/todos/filters?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch filtered todos.");
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("Failed to apply filters. Please try again.");
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodo(todo.id);
    setEditForm({
      task: todo.task,
      deadline: todo.deadline,
      assigned_users: todo.assigned_users.map((u) => u.id), // Assuming `id` is available
      resources: todo.resources?.map((res) => res.name).join(", "),
    });
  };

  const handleSave = async () => {
    try {
      await updateTodo(editingTodo, {
        task: editForm.task,
        deadline: editForm.deadline,
        assigned_users: editForm.assigned_users, // This is passed as an array of user IDs
        resources: editForm.resources
          ? editForm.resources.split(",").map((name) => ({ name: name.trim(), url: name.trim() }))
          : [],
      });
      fetchAllTodos();
      setEditingTodo(null);
      setError(null);
    } catch (error) {
      setError("Failed to save the updated To-Do.");
    }
  };

  const handleCancel = () => {
    setEditingTodo(null);
    setEditForm({ task: "", deadline: "", assigned_users: [], resources: "" });
  };

  return (
    <div className="todo-list-container">
      <h2>To-Do List</h2>

      {/* Filter Section */}
      <div className="filters">
        <input
          type="text"
          placeholder="Task Name"
          value={filters.task_name}
          onChange={(e) => setFilters({ ...filters, task_name: e.target.value })}
        />
        <input
          type="date"
          value={filters.deadline_from}
          onChange={(e) => setFilters({ ...filters, deadline_from: e.target.value })}
        />
        <input
          type="date"
          value={filters.deadline_to}
          onChange={(e) => setFilters({ ...filters, deadline_to: e.target.value })}
        />
        <button onClick={applyFilters}>Apply Filters</button>
      </div>

      {loading ? (
        <p>Loading todos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : todos.length === 0 ? (
        <p>No todos found. Try adjusting your filters.</p>
      ) : (
        <ul>
          {todos.map((todo) =>
            editingTodo === todo.id ? (
              <li key={todo.id} className="todo-item editing">
                 <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.task}
                    onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                  />
                  <input
                    type="datetime-local"
                    value={new Date(editForm.deadline).toISOString().slice(0, 16)}
                    onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                  />
                  
                  {/* Multi-select dropdown for Assigned Users */}
                  <select
                    multiple
                    value={editForm.assigned_users}
                    onChange={(e) => {
                      const selectedUsers = Array.from(e.target.selectedOptions, (option) => parseInt(option.value, 10));
                      setEditForm({ ...editForm, assigned_users: selectedUsers });
                    }}
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="Resources (comma-separated URLs)"
                    value={editForm.resources}
                    onChange={(e) => setEditForm({ ...editForm, resources: e.target.value })}
                  />
                  <button onClick={handleSave} className="save-btn">Save</button>
                  <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                </div>
              </li>
            ) : (
              <li key={todo.id} className="todo-item">
                <div className="todo-details">
                  <strong>{todo.task}</strong>
                  <br />
                  Deadline: {new Date(todo.deadline).toLocaleString()}
                  <br />
                  Assigned Users: {todo.assigned_users.map((u) => u.name).join(", ")}
                  <br />
                  Resources:{" "}
                  {todo.resources?.length
                    ? todo.resources.map((res, index) => (
                        <a key={index} href={res.url} target="_blank" rel="noopener noreferrer">
                          {res.name}
                        </a>
                      ))
                    : "None"}
                </div>
                <button onClick={() => handleEditClick(todo)} className="edit-btn">Edit</button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
