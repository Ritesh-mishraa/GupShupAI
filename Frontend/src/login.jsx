import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle error messages
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // Send email and password to the backend
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful for user:", email); // Log the username (email) to the console
        localStorage.setItem("token", data.token); // Store the token in localStorage
        navigate("/"); // Redirect to the home page after login
      } else {
        setError(data.message || "Invalid credentials"); // Display error message
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Something went wrong. Please try again later."); // Handle unexpected errors
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        <div style={{marginTop: "20px"}}>
          Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          style={{ color: "#007BFF", cursor: "pointer"}}
        >
          Sign up
        </span>
        </div>
        
      </form>
    </div>
  );
}

export default Login;
