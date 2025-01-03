import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/login";
import CreateUser from "./components/createUser"; // Import CreateUser component
import TodoList from "./components/TodoList";
import CreateTodo from "./components/createTodo";
import { createTodo } from "./services/api"; 
import PatientManagement from "./components/patientsManagement";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { FaKey } from "react-icons/fa";
import Box from "@mui/material/Box";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      setUserName(localStorage.getItem("userName") || "");
      setUserRole(localStorage.getItem("userRole") || "");
    } else {
      const allowedRoutes = ["/", "/create-user"]; // Routes that don't require authentication
      if (!allowedRoutes.includes(window.location.pathname)) {
        navigate("/"); // Redirect to login if not on an allowed route
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to login
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleCreateTodo = async (newTodo) => {
    try {
      const response = await createTodo(newTodo);
      console.log("To-Do created successfully:", response);
    } catch (error) {
      console.error("Error creating To-Do:", error);
      throw error; // Propagate the error to be handled in the child component
    }
  };

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">To-Do Management App</h1>
        {isAuthenticated && (
          <div className="user-info">
            Logged in as: <strong>{userName} - {userRole}</strong>
            <button onClick={handleLogout} className="logout-button">
              <FaKey className="logout-icon" />
            </button>
          </div>
        )}
      </header>
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />

        {/* Create User (Register) Route */}
        <Route
          path="/create-user"
          element={<CreateUser />}
        />

        {/* Protected Home Route */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <div className="app-container">
                <Box>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    textColor="primary"
                    indicatorColor="primary"
                  >
                    <Tab label="To-Do List" />
                    <Tab label="Create To-Do" />
                    <Tab label="Patient Management" />
                  </Tabs>
                  <Box className="tab-content">
                    {activeTab === 0 && <TodoList />}
                    {activeTab === 1 && <CreateTodo onCreate={handleCreateTodo} />}
                    {activeTab === 2 && <PatientManagement />}
                  </Box>
                </Box>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;
