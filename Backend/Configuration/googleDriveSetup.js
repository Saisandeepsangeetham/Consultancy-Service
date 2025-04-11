import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CREDENTIALS_PATH = path.join(__dirname,'..', 'Credentials', 'wise-bongo-451704-r2-d933f43f98f5.json');

const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));


dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export const createFolder = async(folderName) =>{
  const parentId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;
  const fileMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId],
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    fields: 'id',
  });

  const folderId =  response.data.id;

  await drive.permissions.create({
    fileId: folderId,
    requestBody: {
      role: 'reader',
      type: 'anyone',
      allowFileDiscovery: false,
    }
  });

  return folderId;
}

export const uploadFile = async(filePath, fileName, mimeType, parentFolderId)=> {
  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: mimeType,
    body: fs.createReadStream(filePath),
  };

  const response = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id',
  });

  return response.data.id;
}