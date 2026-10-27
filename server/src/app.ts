import express from 'express';
import cors from 'cors';
import contactsRoutes from './modules/contacts/contacts.routes';
import authRoute from './modules/auth/auth.routes'

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/prasad', authRoute)
app.use("/prasad", contactsRoutes);
export default app;
