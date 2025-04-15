import React, { useState } from "react";
import NavBar from "../components/NavBar";
import { formsubmission } from "../Helpers/api_communicator";
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Stack,
  FormHelperText,
  InputAdornment,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

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

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { billProof, agreement } = formData;

    if (!billProof || !agreement) {
      setAlert({
        open: true,
        message: "Please upload all the required documents",
        severity: "error",
      });
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    setLoading(true);
    try {
      const response = await formsubmission(data);
      if (response.status === 200) {
        setAlert({
          open: true,
          message: "Form submitted successfully",
          severity: "success",
        });
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
      setAlert({
        open: true,
        message:
          error.response?.data?.message ||
          "There was an error submitting the form.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ mb: 4, textAlign: "start" }}>
            <Typography
              variant="h5"
              component="h2"
              color="black"
              fontWeight="medium">
              Consultancy Project Details
            </Typography>
          </Box>

          <Box component="form" noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Industry Name"
                name="industryName"
                value={formData.industryName}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Project Duration (in months)"
                name="projectDuration"
                type="number"
                value={formData.projectDuration}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">months</InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Project Title"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Principal Investigator"
                name="pi"
                value={formData.pi}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Co-Principal Investigator"
                name="coPI"
                value={formData.coPI}
                onChange={handleChange}
                variant="outlined"
              />

              <FormControl fullWidth required>
                <InputLabel id="academic-year-label">Academic Year</InputLabel>
                <Select
                  labelId="academic-year-label"
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  label="Academic Year">
                  <MenuItem value="">
                    <em>--Select Academic Year--</em>
                  </MenuItem>
                  <MenuItem value="1st Year">1st Year</MenuItem>
                  <MenuItem value="2nd Year">2nd Year</MenuItem>
                  <MenuItem value="3rd Year">3rd Year</MenuItem>
                  <MenuItem value="4th Year">4th Year</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount Sanctioned (₹)"
                name="amountSanctioned"
                type="number"
                value={formData.amountSanctioned}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Amount Received (₹)"
                name="amountReceived"
                type="number"
                value={formData.amountReceived}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₹</InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Bill Settlement Details"
                name="billDetails"
                multiline
                rows={3}
                value={formData.billDetails}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Bill Proof Upload:
                </Typography>
                <input
                  type="file"
                  name="billProof"
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  style={{ width: "100%", padding: "10px 0" }}
                />
                {formData.billProof && (
                  <FormHelperText>
                    Selected file: {formData.billProof.name}
                  </FormHelperText>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Signed Agreement Upload:
                </Typography>
                <input
                  type="file"
                  name="agreement"
                  onChange={handleChange}
                  accept=".pdf"
                  required
                  style={{ width: "100%", padding: "10px 0" }}
                />
                {formData.agreement && (
                  <FormHelperText>
                    Selected file: {formData.agreement.name}
                  </FormHelperText>
                )}
              </Box>

              <TextField
                fullWidth
                label="Student Details"
                name="studentDetails"
                multiline
                rows={3}
                placeholder="Enter student names and roles"
                value={formData.studentDetails}
                onChange={handleChange}
                required
                variant="outlined"
              />

              <Box>
                <TextField
                  fullWidth
                  label="Project Summary (100 words)"
                  name="projectSummary"
                  multiline
                  rows={4}
                  value={formData.projectSummary}
                  onChange={handleChange}
                  inputProps={{ maxLength: 500 }}
                  required
                  variant="outlined"
                />
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, textAlign: "right" }}>
                  {formData.projectSummary.length}/500 characters
                </Typography>
              </Box>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ px: 4, py: 1, fontSize: "1rem" }}>
                  {loading ? (
                    <>
                      <CircularProgress
                        size={24}
                        color="inherit"
                        sx={{ mr: 1 }}
                      />{" "}
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Form;
