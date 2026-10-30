import { Router } from 'express';
import { getUsers, createUser, editUser, deleteUser } from './contacts.controller';
import authMiddleware from '.././auth/auth.middleware';

const router = Router();

router.get("/test", (req, res) => {
    res.send("Backend is running");
});

//Read
router.get('/getUserData',authMiddleware, getUsers);

//Create
router.post('/postUserData',authMiddleware, createUser)

//update
router.put('/putUserData',authMiddleware, editUser)

//Delete
router.delete('/deleteUserData/:id',authMiddleware, deleteUser)

export default router;