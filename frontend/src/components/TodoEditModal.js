import React, { useState, useEffect } from "react";
import "../App.css";
import { getUsers } from "../services/api"; // Fetch users for selection

const TodoEditModal = ({ todo, onClose, onSave }) => {
  const [task, setTask] = useState(todo?.task || "");
  const [deadline, setDeadline] = useState(todo?.deadline || "");
  const [assignedUsers, setAssignedUsers] = useState(todo?.assigned_users || []);
  const [resources, setResources] = useState(
    todo?.resources?.map((res) => res.url).join(", ") || ""
  );
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSave = () => {
    const updatedTodo = {
      ...todo,
      task,
      deadline,
      assigned_users: assignedUsers,
      resources: resources
        .split(",")
        .map((url) => ({ name: url.trim(), url: url.trim() })),
    };
    onSave(updatedTodo);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit To-Do</h2>
        <label>
          Task:
          <input
            type="text"
            className="regular-input"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </label>
        <label>
          Deadline:
          <input
            type="datetime-local"
            value={new Date(deadline).toISOString().slice(0, -1)}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>
        <label>
          Assigned Users:
          <select
            multiple
            value={assignedUsers}
            onChange={(e) =>
              setAssignedUsers(
                Array.from(e.target.selectedOptions, (option) =>
                  parseInt(option.value, 10)
                )
              )
            }
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </label>
        <label>
          Resources:
          <textarea
            className="regular-textarea"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
          />
        </label>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default TodoEditModal;
