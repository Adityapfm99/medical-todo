import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [doctorNumber, setDoctorNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    try {
      const userData = { name, email, password, role };
      if (role.toLowerCase() === "doctor") {
        userData.doctorNumber = doctorNumber;
      }
      await axios.post("/users", userData);
      setSuccess("Registration successful!");
      setTimeout(() => navigate("/"), 2000); // Redirect after 2 seconds
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <input
            type="text"
            placeholder="Role (e.g., user or doctor)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        {role.toLowerCase() === "doctor" && (
          <div>
            <label>Doctor Number</label>
            <input
              type="text"
              placeholder="Doctor Number"
              value={doctorNumber}
              onChange={(e) => setDoctorNumber(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
