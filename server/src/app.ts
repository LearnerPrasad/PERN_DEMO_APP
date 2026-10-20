import express from 'express';
import cors from 'cors';
import userRoutes from './modules/users/user.routes';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use(userRoutes);

export default app;
