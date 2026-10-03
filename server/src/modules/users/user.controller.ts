import type { RequestHandler } from 'express';
import {
    createUserWithEmailCheck,
    deleteUserById,
    getAllUsers,
    updateUserById,
    userEmailExistsForAnotherUser,
} from './user.service';
import { ValidateUserFields, ValidateUserId } from './user.validation';

export const getUsers: RequestHandler = async (req, res) => {
    try {
        const result = await getAllUsers();
        res.json(result);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};

export const createUser: RequestHandler = async (req, res) => {
    const { name, email, city } = req.body ?? {};

    if (!ValidateUserFields({ name, email, city })) {
        return res.status(400).json({
            error: 'Name, email, and city are required',
        })
    };

    try {
        const result = await createUserWithEmailCheck({ name, email, city });

        if (result.kind === 'email-exists') {
            return res.status(400).json({ error: 'Email already exists' });
        }

        return res.status(201).json(result.user);
    } catch (err) {
        console.error('Error creating user', err);
        return res.status(500).json({ error: 'Failed to create user' });
    }

}

export const editUser: RequestHandler = async (req, res) => {
    const { id, name, email, city } = req.body ?? {};

    if (!ValidateUserFields({ name, email, city })) {
        return res.status(400).json({
            error: 'Name, email, and city are required',
        })
    }

    if (!ValidateUserId(id)) {
        return res.status(400).json({
            error: "Invalid Id "
        })
    }
    try {
        const normalisedEmail = email.trim();
        if (await userEmailExistsForAnotherUser(normalisedEmail, id)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const updatedUser = await updateUserById({
            id,
            name,
            email: normalisedEmail,
            city,
        });

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json(updatedUser);
    } catch (err) {
        console.error('Error updating user', err);
        return res.status(500).json({ error: 'Failed to update user' });
    }
}

export const deleteUser: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (!ValidateUserId(id)) {
        return res.status(400).json({
            error: "Invalid Id "
        })
    }
    try {
        const deleted = await deleteUserById(id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        return res.status(500).json({ error: "Failed   to delete  user" })
    }
}