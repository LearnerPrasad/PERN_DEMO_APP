import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db'
import cors from 'cors';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
dotenv.config();

app.get("/test", (_req, res) => {
  res.send("Backend is running");
});

//Read
app.get('/getUserData', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
})

//Create
app.post('/postUserData', async (req, res) => {
  const { name, email, city } = req.body ?? {};

  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof city !== 'string' || !city.trim()
  ) {
    return res.status(400).json({ error: 'Name, email, and city are required' });
  }

  const normalisedEmail = email.trim();
  const userAlreadyExists = await pool.query('SELECt email FROM users WHERE email = $1', [normalisedEmail]);
  if (userAlreadyExists.rows.length > 0) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  try {
    const result = await pool.query('INSERT INTO users(name, email, city) VALUES ($1, $2, $3) RETURNING *', [name, email, city]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
})

//update
app.put('/putUserData', async (req, res) => {
  //same validation as postUserData
  //empty check for name, email, city
  const { id, name, email, city } = req.body ?? {};

  if (!Number.isSafeInteger(id) || Number(id) <= 0) {
    return res.status(400).json({ error: 'user does not exists' })
  }


  if (
    typeof name !== 'string' || !name.trim() ||
    typeof email !== 'string' || !email.trim() ||
    typeof city !== 'string' || !city.trim()
  ) {
    return res.status(400).json({ error: 'Name, email, and city are required' });
  }
  //i should also check duplicates email
  const normalisedEmail = email.trim();
  const result = await pool.query('SELECT id FROM users WHERE email = $1 AND id <> $2 ', [normalisedEmail, id]);
  if (result.rows.length > 0) {
    return res.status(400).json({ error: 'Email already exists' })
  }
  //now if i insert ,it will insert at end of table, but i want to update the existing record with the new data 
  //iam also getting id this time
  //'UPDATE users SET name = $1, email = $2, city = $3
  //WHERE id =$4] RETURNING *,[name,email,city,id] 

  const updatedUser = await pool.query(
    `UPDATE users
   SET name = $1, email = $2, city = $3
   WHERE id = $4
   RETURNING *`,
    [name, email, city, id]
  );

  if (updatedUser.rowCount === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json(updatedUser.rows[0]);
})

//Delete
app.delete('/deleteUserData/:id', async (req, res) => {

  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    return res.status(500).json({ error: "Failed   to delete  user" })
  }
})
app.listen(3000, () => {
  console.log("Backend listening at http://localhost:3000/test");
});
