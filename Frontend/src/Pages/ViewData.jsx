import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  Typography,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NavBar from "../components/NavBar";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";

const ViewData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    academicYear: "",
    minAmount: "",
    maxAmount: "",
    pi: "",
    copi: "",
    industryName: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:8000/api/getData", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(response.data.data || []);
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    setLoading(true);
    setError("");
    try {
      let endpoint = "http://localhost:8000/api/getData";
      
      if (filters.pi) {
        endpoint = `http://localhost:8000/api/getDataByPI/${filters.pi}`;
      }
      else if (filters.copi) {
        endpoint = `http://localhost:8000/api/getDataBycoPI/${filters.copi}`;
      }
      else if (filters.minAmount && filters.maxAmount) {
        endpoint = `http://localhost:8000/api/getDataBySanctionAmt/${filters.minAmount}/${filters.maxAmount}`;
      }
      else if (filters.industryName){
        endpoint = `http://localhost:8000/api/getDataByIndustryName/${filters.industryName}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      let filteredData = response.data.data || [];
      
      if (filters.academicYear && filteredData.length > 0) {
        filteredData = filteredData.filter(item => 
          item.academicYear === filters.academicYear
        );
      }
      
      setData(filteredData);
    } catch (error) {
      setError("Failed to apply filters. Please try again.");
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      academicYear: "",
      minAmount: "",
      maxAmount: "",
      pi: "",
      copi: "",
      industryName: "",
    });
    fetchData();
  };

  const downloadExcel = () => {
    const worksheetData = data.map(item => ({
      "Industry Name": item.industryName,
      "Project Title": item.projectTitle,
      "Duration (months)": item.projectDuration,
      "Principal Investigator": item.pi,
      "Co-Principal Investigator": item.coPI,
      "Academic Year": item.academicYear,
      "Amount Sanctioned": item.amountSanctioned,
      "Amount Received": item.amountReceived,
      "Bill Details": item.billDetails,
      "Student Details": item.studentDetails,
      "Project Summary": item.projectSummary,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ConsultancyProjects");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "ConsultancyProjects.xlsx");
  };

  return (
    <div>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          View Consultancy Projects
        </Typography>

        <Paper sx={{ p: 3, mb: 4, bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" fontWeight="medium" color="primary">
              Filter Projects
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={applyFilters}
                disabled={loading}
                startIcon={<SearchIcon />}
                sx={{ mr: 1 }}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined" 
                onClick={resetFilters}
                disabled={loading}
                startIcon={<ClearAllIcon />}
              >
                Reset
              </Button>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {/* Academic Year Filter */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', height: '100%', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Academic Year
                </Typography>
                <FormControl fullWidth size="small">
                  <Select 
                    name="academicYear" 
                    value={filters.academicYear} 
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="">All Years</MenuItem>
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Year">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>

            {/* Industry Name Filter */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', height: '100%', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Industry Name
                </Typography>
                <TextField
                  name="industryName"
                  placeholder="Search by industry"
                  fullWidth
                  size="small"
                  value={filters.industryName}
                  onChange={handleChange}
                />
              </Paper>
            </Grid>
            
            {/* Principal Investigator Filter */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', height: '100%', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Principal Investigator
                </Typography>
                <TextField
                  name="pi"
                  placeholder="Search by PI name"
                  fullWidth
                  size="small"
                  value={filters.pi}
                  onChange={handleChange}
                />
              </Paper>
            </Grid>
            
            {/* Co-Principal Investigator Filter */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', height: '100%', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Co-Principal Investigator
                </Typography>
                <TextField
                  name="copi"
                  placeholder="Search by Co-PI name"
                  fullWidth
                  size="small"
                  value={filters.copi}
                  onChange={handleChange}
                />
              </Paper>
            </Grid>
            
            {/* Amount Range Filter */}
            <Grid item xs={12} md={8} lg={6}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Amount Range (₹)
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    name="minAmount"
                    placeholder="Minimum"
                    type="number"
                    fullWidth
                    size="small"
                    value={filters.minAmount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 1 }}>to</Box>
                  <TextField
                    name="maxAmount"
                    placeholder="Maximum"
                    type="number"
                    fullWidth
                    size="small"
                    value={filters.maxAmount}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
          <Typography variant="h6">
            {data.length} Projects Found
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={downloadExcel}
            disabled={loading || data.length === 0}
          >
            Download Excel
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Industry Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Project Title</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Principal Investor</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Co-Principal Investor</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Academic Year</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount Sanctioned</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount Received</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.industryName}</TableCell>
                      <TableCell>{row.projectTitle}</TableCell>
                      <TableCell>{row.pi}</TableCell>
                      <TableCell>{row.coPI}</TableCell>
                      <TableCell>{row.academicYear}</TableCell>
                      <TableCell>{row.amountSanctioned}</TableCell>
                      <TableCell>{row.amountReceived}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </div>
  );
};

export default ViewData;
