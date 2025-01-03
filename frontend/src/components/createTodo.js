import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
} from "@mui/material";
import { getUsers } from "../services/api";

const TodoManagement = ({ onCreate = () => Promise.reject("onCreate not provided") }) => {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [resources, setResources] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      console.log("Fetching users...");
      setLoadingUsers(true);
      try {
        const response = await getUsers();
        console.log("Users fetched:", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Validate URLs in the resources field
  const validateUrls = (urls) => {
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
    return urls.every((url) => urlRegex.test(url.trim()));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resourceArray = resources
      ? resources.split(",").map((res) => ({ name: res.trim(), url: res.trim() }))
      : [];

    if (resources && !validateUrls(resourceArray.map((res) => res.url))) {
      setError("Invalid URLs in the resources field.");
      return;
    }

    const newTodo = {
      task,
      deadline,
      created_by: 1,
      assigned_users: assignedUser ? [parseInt(assignedUser, 10)] : [],
      resources: resourceArray,
    };

    console.log("Submitting new To-Do:", newTodo);

    try {
      await onCreate(newTodo);
      setTask("");
      setDeadline("");
      setAssignedUser("");
      setResources("");
      setError(null);
      setSuccessMessage("To-Do created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error creating todo:", error);
      setError("Failed to create To-Do. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {/* Success and Error Messages */}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* Create To-Do Form */}
      <div className="create-todo-container" style={{ marginTop: "20px" }}>
        <h3>Create To-Do</h3>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            type="datetime-local"
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="assigned-user-label">Assigned Users</InputLabel>
            <Select
              value={assignedUser}
              onChange={(e) => setAssignedUser(e.target.value)}
              required
              disabled={loadingUsers || users.length === 0}
            >
              <MenuItem value="" disabled>
                {loadingUsers ? "Loading..." : "Select a user"}
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Resources (comma-separated URLs)"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            margin="normal"
            placeholder="e.g., https://example.com, https://another.com"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Create To-Do
          </Button>
        </form>
      </div>
    </div>
  );
};

export default TodoManagement;
