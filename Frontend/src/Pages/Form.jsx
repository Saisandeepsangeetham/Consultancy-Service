import React, { useState } from "react";
import "../CSS/form.css";
import NavBar from "../components/NavBar";

const Form = () => {
  const [formData, setFormData] = useState({
    industryName: "",
    projectDuration: "",
    projectTitle: "",
    pi: "",
    coPI: "",
    academicYear: "",
    amountSanctioned: "",
    amountReceived: "",
    billDetails: "",
    billProof: null,
    agreement: null,
    studentDetails: "",
    projectSummary: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div>
      <NavBar />
      <div className="form-container">
        <nav className="form-nav">
          <h2>Consultancy Project Details</h2>
        </nav>

        <form className="project-form">
          <div className="form-group">
            <label>Industry Name:</label>
            <input
              type="text"
              name="industryName"
              value={formData.industryName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Duration (in months):</label>
            <input
              type="number"
              name="projectDuration"
              value={formData.projectDuration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Project Title:</label>
            <input
              type="text"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Principal Investigator:</label>
            <input
              type="text"
              name="pi"
              value={formData.pi}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Co-Principal Investigator:</label>
            <input
              type="text"
              name="coPI"
              value={formData.coPI}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Academic Year:</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              placeholder="YYYY-YYYY"
            />
          </div>

          <div className="form-group">
            <label>Amount Sanctioned (₹):</label>
            <input
              type="number"
              name="amountSanctioned"
              value={formData.amountSanctioned}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount Received (₹):</label>
            <input
              type="number"
              name="amountReceived"
              value={formData.amountReceived}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bill Settlement Details:</label>
            <textarea
              name="billDetails"
              value={formData.billDetails}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Bill Proof Upload:</label>
            <input
              type="file"
              name="billProof"
              onChange={handleChange}
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>

          <div className="form-group">
            <label>Signed Agreement Upload:</label>
            <input
              type="file"
              name="agreement"
              onChange={handleChange}
              accept=".pdf"
              required
            />
          </div>

          <div className="form-group">
            <label>Student Details:</label>
            <textarea
              name="studentDetails"
              value={formData.studentDetails}
              onChange={handleChange}
              placeholder="Enter student names and roles"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Summary (100 words):</label>
            <textarea
              name="projectSummary"
              value={formData.projectSummary}
              onChange={handleChange}
              maxLength={500}
              required
            />
            <small>{formData.projectSummary.length}/500 characters</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Project Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
