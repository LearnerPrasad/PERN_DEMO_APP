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
router.post('/postUserData', createUser)

//update
router.put('/putUserData', editUser)

//Delete
router.delete('/deleteUserData/:id', deleteUser)

export default router;