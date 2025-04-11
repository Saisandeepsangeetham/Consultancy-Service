import React, { useState } from "react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Helpers/api_communicator";

const Signup = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    psd: "",
    con_psd: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/form");
    }
  }, [navigate]);

  const gotoLogin = () => {
    navigate("/");
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!credentials.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (credentials.psd !== credentials.con_psd) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser(credentials);

      if (result.success) {
        navigate("/", {
          state: { message: "Registration successful! Please login." },
        });
      } else {
        setError(result.error || "Registration failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_container">
      <div className="brand"></div>
      <div className="login">
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={credentials.name}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                name: e.target.value,
              })
            }
            required
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={credentials.email}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                email: e.target.value,
              })
            }
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={credentials.psd}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                psd: e.target.value,
              })
            }
            required
          />
          <input
            type="password"
            placeholder="Confirm your password"
            value={credentials.con_psd}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                con_psd: e.target.value,
              })
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
            value={loading ? "Signing up..." : "Sign Up"}
            disabled={loading}
          />
          <a onClick={gotoLogin} style={{ cursor: "pointer" }}>
            Already have an account?
          </a>
        </form>
      </div>
    </div>
  );
};

export default Signup;
