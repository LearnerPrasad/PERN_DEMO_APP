import dotenv from 'dotenv';
dotenv.config();
import app from './app';

app.listen(3000, () => {
  console.log("Backend listening at http://localhost:3000/prasad");
});
