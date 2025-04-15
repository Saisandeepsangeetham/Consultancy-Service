import React, { useState, useEffect } from "react";
import "../CSS/login.css";
import { useNavigate } from "react-router-dom";
import { forgotPsd } from "../Helpers/api_communicator";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    psd: "",
    confirmPsd: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifiedEmail = sessionStorage.getItem("verified_email");

    if (!verifiedEmail) {
      navigate("/verifyotp");
      return;
    }

    setCredentials((prev) => ({
      ...prev,
      email: verifiedEmail,
    }));
  }, [navigate]);

  const gotoLogin = () => {
    navigate("/");
  };

  const handleForgotPsd = async (event) => {
    event.preventDefault();

    if (credentials.psd !== credentials.confirmPsd) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await forgotPsd(credentials);

      if (result.success) {
        sessionStorage.removeItem("verified_email");

        navigate("/", {
          state: { message: "Password successfully updated! Please login." },
        });
      } else {
        setError(result.error || "Password update failed");
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
          <h2>Reset Password</h2>

          <input
            type="email"
            placeholder="Your verified email"
            value={credentials.email}
            disabled
            required
          />
          <input
            type="password"
            placeholder="Enter your new password"
            value={credentials.psd}
            onChange={(e) => {
              setCredentials({
                ...credentials,
                psd: e.target.value,
              });
            }}
            required
          />
          <input
            type="password"
            placeholder="Confirm your new password"
            value={credentials.confirmPsd}
            onChange={(e) => {
              setCredentials({
                ...credentials,
                confirmPsd: e.target.value,
              });
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
            value={loading ? "Updating Password..." : "Update Password"}
            disabled={loading}
          />
          <a onClick={gotoLogin} style={{ cursor: "pointer" }}>
            Remember your password? Login
          </a>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
