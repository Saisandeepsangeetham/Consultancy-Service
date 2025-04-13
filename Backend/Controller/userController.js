import User from "../Model/modelSchema.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import fs from "fs";
import { google } from "googleapis";
import { createFolder, uploadFile } from '../Configuration/googleDriveSetup.js';
import  dotenv  from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};


export const forgotPsd = async(req,res)=>{
  const {email,psd} = req.body;
  try{
    const user = await User.findOne({ email :email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  
  user.password = psd;
  await user.save(); 
  res.status(200).json({ success: true, message: "Password updated successfully" });
  }

  catch(error){
    console.log(error);
    res.status(500).json({message:error});
  }
  

  
};

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectTitle = req.body.projectTitle || "defaultProject";
    const projectFolder = path.join(uploadDir, projectTitle);
    if (!fs.existsSync(projectFolder)) {
      fs.mkdirSync(projectFolder, { recursive: true });
    }
    cb(null, projectFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "billProof") {
    const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type for bill proof. Only PDF, JPG, JPEG, PNG allowed."));
    }
  } else if (file.fieldname === "agreement") {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type for signed agreement. Only PDF allowed."));
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
}).fields([
  { name: "billProof", maxCount: 1 },
  { name: "agreement", maxCount: 1 },
]);

export const handleSubmit = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const {
      industryName,
      projectDuration,
      projectTitle,
      pi,
      coPI,
      academicYear,
      amountSanctioned,
      amountReceived,
      billDetails,
      studentDetails,
      projectSummary,
    } = req.body;

    if (!req.files || !req.files.billProof || !req.files.agreement) {
      return res.status(400).json({ error: "Both Bill Proof and Signed Agreement files are required." });
    }

    const billProofFile = req.files.billProof[0];
    const agreementFile = req.files.agreement[0];

    try {
      const driveFolderId = await createFolder(projectTitle);
      console.log("Created Google Drive folder with ID:", driveFolderId);

      const billProofDriveId = await uploadFile(
        billProofFile.path,
        billProofFile.filename,
        billProofFile.mimetype,
        driveFolderId
      );

      const agreementDriveId = await uploadFile(
        agreementFile.path,
        agreementFile.filename,
        agreementFile.mimetype,
        driveFolderId
      );

      const billProofLink = `https://drive.google.com/file/d/${billProofDriveId}/view`;
      const agreementLink = `https://drive.google.com/file/d/${agreementDriveId}/view`;

      const auth = new google.auth.GoogleAuth({
        keyFile: "C:/Users/sriva/OneDrive/Desktop/sem/sem6/Internet Programming/Consultancy-Service/Backend/Credentials/wise-bongo-451704-r2-11c606e1ced8.json", 
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const client = await auth.getClient();
      const sheets = google.sheets({ version: "v4", auth: client });
      
      const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
      const range = "Sheet1!A1"; 
      
      const newRow = [
        industryName,
        projectDuration,
        projectTitle,
        pi,
        coPI,
        academicYear,
        amountSanctioned,
        amountReceived,
        billDetails,
        billProofLink,
        agreementLink,
        studentDetails,
        projectSummary,
      ];
      
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        resource: {
          values: [newRow],
        },
      });
      
      res.status(200).json({
        message: "Data successfully appended to Google Sheet and files uploaded to Google Drive.",
        billProofLink,
        agreementLink,
      });
    } catch (error) {
      console.error("Error processing submission:", error);
      res.status(500).json({ error: "An error occurred while processing the submission." });
    }
  });
};


export const getSubmissions = async (req, res) => {

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "C:/Users/sriva/OneDrive/Desktop/sem/sem6/Internet Programming/Consultancy-Service/Backend/Credentials/wise-bongo-451704-r2-11c606e1ced8.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = "Sheet1!A2:M"; // Skip header row (assuming headers are in row 1)

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ data: [], message: "No data found in the sheet." });
    }

    const formattedData = rows.map((row) => ({
      industryName: row[0] || "",
      projectDuration: row[1] || "",
      projectTitle: row[2] || "",
      pi: row[3] || "",
      coPI: row[4] || "",
      academicYear: row[5] || "",
      amountSanctioned: row[6] || "",
      amountReceived: row[7] || "",
      billDetails: row[8] || "",
      billProofLink: row[9] || "",
      agreementLink: row[10] || "",
      studentDetails: row[11] || "",
      projectSummary: row[12] || "",
    }));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching data from Google Sheet:", error);
    res.status(500).json({ error: "An error occurred while fetching data from the sheet." });
  }
};



export const getByPI = async (req, res) => {
  const { pi } = req.params;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "C:/Users/sriva/OneDrive/Desktop/sem/sem6/Internet Programming/Consultancy-Service/Backend/Credentials/wise-bongo-451704-r2-11c606e1ced8.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = "Sheet1!A2:M";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ data: [], message: "No data found in the sheet." });
    }

    let formattedData = rows.map((row) => ({
      industryName: row[0] || "",
      projectDuration: row[1] || "",
      projectTitle: row[2] || "",
      pi: row[3] || "",
      coPI: row[4] || "",
      academicYear: row[5] || "",
      amountSanctioned: row[6] || "",
      amountReceived: row[7] || "",
      billDetails: row[8] || "",
      billProofLink: row[9] || "",
      agreementLink: row[10] || "",
      studentDetails: row[11] || "",
      projectSummary: row[12] || "",
    }));

    const filteredData = formattedData.filter(
      (item) => item.pi.toLowerCase().includes(pi.toLowerCase())
    );

    res.status(200).json({ data: filteredData });
  } catch (error) {
    console.error("Error filtering data by PI:", error);
    res.status(500).json({ error: "An error occurred while fetching data by PI." });
  }
};


export const getByCoPI = async (req, res) => {
  const { coPI } = req.params;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "C:/Users/sriva/OneDrive/Desktop/sem/sem6/Internet Programming/Consultancy-Service/Backend/Credentials/wise-bongo-451704-r2-11c606e1ced8.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = "Sheet1!A2:M"; // Skip header

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ data: [], message: "No data found in the sheet." });
    }

    const formattedData = rows.map((row) => ({
      industryName: row[0] || "",
      projectDuration: row[1] || "",
      projectTitle: row[2] || "",
      pi: row[3] || "",
      coPI: row[4] || "",
      academicYear: row[5] || "",
      amountSanctioned: row[6] || "",
      amountReceived: row[7] || "",
      billDetails: row[8] || "",
      billProofLink: row[9] || "",
      agreementLink: row[10] || "",
      studentDetails: row[11] || "",
      projectSummary: row[12] || "",
    }));

    const filteredData = formattedData.filter((entry) =>
      entry.coPI.toLowerCase().includes(coPI.toLowerCase())
    );

    res.status(200).json({ data: filteredData });
  } catch (error) {
    console.error("Error filtering by Co-PI:", error);
    res.status(500).json({ error: "An error occurred while filtering by Co-PI." });
  }
};

export const getBySanctionedAmountRange = async (req, res) => {
  const { minAmount, maxAmount } = req.params;  
  
  if (!minAmount || !maxAmount) {
    return res.status(400).json({ error: "Please provide both minAmount and maxAmount" });
  }

  try {
    
    const auth = new google.auth.GoogleAuth({
      keyFile: "C:/Users/sriva/OneDrive/Desktop/sem/sem6/Internet Programming/Consultancy-Service/Backend/Credentials/wise-bongo-451704-r2-11c606e1ced8.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const range = "Sheet1!A2:M"; 

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ data: [], message: "No data found in the sheet." });
    }

    // Format the data from the sheet
    const formattedData = rows.map((row) => ({
      industryName: row[0] || "",
      projectDuration: row[1] || "",
      projectTitle: row[2] || "",
      pi: row[3] || "",
      coPI: row[4] || "",
      academicYear: row[5] || "",
      amountSanctioned: row[6] || "",
      amountReceived: row[7] || "",
      billDetails: row[8] || "",
      billProofLink: row[9] || "",
      agreementLink: row[10] || "",
      studentDetails: row[11] || "",
      projectSummary: row[12] || "",
    }));

    
    const filteredData = formattedData.filter((item) => {
      const sanctionedAmount = parseFloat(item.amountSanctioned.replace(/[^0-9.]/g, ''));

      
      return sanctionedAmount >= parseFloat(minAmount) && sanctionedAmount <= parseFloat(maxAmount);
    });

    res.status(200).json({ data: filteredData });

  } catch (error) {
    console.error("Error fetching or filtering data:", error);
    res.status(500).json({ error: "An error occurred while fetching or filtering data." });
  }
};


