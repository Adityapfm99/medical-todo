import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      // Save user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userRole", user.role);

      // Redirect to the home page
      navigate("/home");
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid login credentials. Please try again."
      );
    }
  };

  const navigateToRegister = () => {
    navigate("/create-user");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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
          <button type="submit">Login</button>
        </form>
        <div className="register-link">
          <p>
            Don’t have an account?{" "}
            <span
              className="link"
              onClick={navigateToRegister} // Use the separate function here
            >
              Register here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
