import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './Route/index.js';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

const app = express();

dotenv.config();

app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', routes);

app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default app;
