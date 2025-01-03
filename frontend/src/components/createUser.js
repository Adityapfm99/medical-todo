import React, { useState } from "react";
import { createUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Doctor"); // Default role is "Doctor"
  const [doctorNumber, setDoctorNumber] = useState(""); // Doctor-specific field
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // To track success state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      role,
      doctor_number: role === "Doctor" ? doctorNumber : null, // Include doctorNumber only for Doctor
    };

    try {
      await createUser(newUser);
      setMessage("User created successfully! Redirecting to login...");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/"); // Redirect to login page
      }, 2000);
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage("Failed to create user. Please try again.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="create-user-page">
      <div className="create-user-container">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Secretary">Secretary</option>
          </select>
          {role === "Doctor" && (
            <input
              type="text"
              placeholder="Doctor Number"
              value={doctorNumber}
              onChange={(e) => setDoctorNumber(e.target.value)}
              required
            />
          )}
          <button type="submit">Register</button>
        </form>
        {message && (
          <p style={{ color: isSuccess ? "green" : "red" }}>{message}</p>
        )}
        <div className="back-to-login">
          <p>
            Already have an account?{" "}
            <a
              className="link"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              href="#"
            >
              Back to Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
