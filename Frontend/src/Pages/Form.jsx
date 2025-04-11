import React, { useState } from "react";
import "../CSS/form.css";
import NavBar from "../components/NavBar";
import { formsubmission } from "../Helpers/api_communicator";

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

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const { billProof, agreement} = formData;

    if(!billProof || !agreement){
      alert("Please upload all the documents");
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await formsubmission(data);
      if(response.status === 200){
        alert("Form submitted successfully");
        setFormData({
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
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "There was an error submitting the form."
      );
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
            <label for="academicYear">Academic Year:</label>
            <select name="academicYear" id="academicYear" value={formData.academicYear} onChange={handleChange} required>
              <option value="">--Select Academic Year--</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
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

          <button type="submit" className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
