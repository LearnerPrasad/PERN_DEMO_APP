import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db'
import cors from 'cors';

const app = express();

app.use(cors({origin: 'http://localhost:5173'}));
dotenv.config();

app.get("/test", (_req, res) => {
  res.send("Backend is running");
});

app.get('/db-test', async (req,res)=>{
    try{
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    }catch(err){
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
})
app.listen(3000, () => {
  console.log("Backend listening at http://localhost:3000/test");
});
