import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../CSS/navBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h2>Consultancy Services</h2>
      </div>

      <div className="nav-items">
        <div className="nav-links">
          <Link
            to="/form"
            className={`nav-link ${
              location.pathname === "/form" ? "active" : ""
            }`}>
            Data Entry
          </Link>
          <Link
            to="/view"
            className={`nav-link ${
              location.pathname === "/view" ? "active" : ""
            }`}>
            View Data
          </Link>
        </div>

        <div className="user-menu" ref={dropdownRef}>
          <div
            className="user-icon-wrapper"
            onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.email && <span className="user-email">{user.email}</span>}
            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="user-info">
                  <span>{user?.email}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
