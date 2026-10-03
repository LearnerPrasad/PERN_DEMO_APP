import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './modules/users/user.routes'

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use(userRoutes)
dotenv.config();

app.listen(3000, () => {
  console.log("Backend listening at http://localhost:3000/test");
});
