import React, { useState, useEffect } from "react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Helpers/api_communicator";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", psd: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/form");
    }
  }, [navigate]);

  const gotoSignup = () => {
    navigate("/signup");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await loginUser(credentials);

      if (result.success) {
        // Successfully logged in
        navigate("/form", { replace: true });
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="brand"></div>
      <div className="login">
        <form onSubmit={handleLogin}>
          <h2>LOGIN</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={credentials.psd}
            onChange={(e) =>
              setCredentials({ ...credentials, psd: e.target.value })
            }
            required
          />
          {error && (
            <div
              style={{
                color: "rgb(255, 237, 39)",
                fontSize: "15px",
                height: "10px",
                textAlign: "left",
                marginBottom: "8px",
              }}>
              {error}
            </div>
          )}
          <input
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />
          <a onClick={gotoSignup} style={{ cursor: "pointer" }}>
            Don't have an account?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Login;
