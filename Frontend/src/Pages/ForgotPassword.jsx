import React, { useState } from "react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";
import { forgotPsd } from "../Helpers/api_communicator";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    psd: ""
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

  const handleForgotPsd = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await forgotPsd(credentials);
        
      if (result.success) {
        navigate("/", {
          state: { message: "Updation successful! Please login." },
        });
      } else {
        setError(result.error || "Updation failed");
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
        <form onSubmit={handleForgotPsd}>
          <h2>Forgot Password</h2>
          
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
            placeholder="Enter your new password"
            value={credentials.psd}
            onChange={(e) =>{
              setCredentials({
                ...credentials,
                psd: e.target.value,
              })
            }}
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
            value={loading ? "Changing Password..." : "Change Password"}
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

export default ForgotPassword;
