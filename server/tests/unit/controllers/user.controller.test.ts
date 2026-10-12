import type { Request, Response } from 'express';

import { getAllUsers, userEmailExistsForAnotherUser, updateUserById, createUserWithEmailCheck, deleteUserById } from '../../../src/modules/users/user.service';
import { getUsers, createUser, editUser, deleteUser } from '../../../src/modules/users/user.controller';

jest.mock('../../../src/modules/users/user.service')
describe("should validate getUsers", () => {
    it("should build error response , if db didnot returned", async () => {
        const mockedGetAllUsers = getAllUsers as jest.Mock;
        mockedGetAllUsers.mockRejectedValue(new Error('DB Error'));

        const req = {} as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        } as unknown as Response;

        const next = jest.fn();

        await getUsers(req, res, next);


        expect(mockedGetAllUsers).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    })
    it("should build success response ,if db returns", async () => {
        const req = {} as Request;
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        const mockedGetAllUsers = getAllUsers as jest.Mock;

        mockedGetAllUsers.mockResolvedValue([{ id: 1, name: 'Test', email: 'Test@gmail.com', city: 'test' }])

        await getUsers(req, res, next)

        expect(mockedGetAllUsers).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Test', email: 'Test@gmail.com', city: 'test' }])
    })
})

describe('edit user validation', () => {
    it('should return 400 when user fields are invalid', async () => {
        const req = {
            body: {
                name: 'test',
                email: '',
                city: 'test'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await createUser(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Name, email, and city are required'
        });

        expect(createUserWithEmailCheck).not.toHaveBeenCalled();
    });

    it('should return 400 when user ID is invalid', async () => {
        const req = {
            body: {
                id: -1,
                name: 'test',
                email: 'test@gmail.com',
                city: 'Tuni'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        await editUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid Id '
        });

        expect(userEmailExistsForAnotherUser).not.toHaveBeenCalled();
        expect(updateUserById).not.toHaveBeenCalled();
    });
    it("should return 500 if updating user fails", async () => {
        const req = {
            body: {
                id: 1,
                name: "Durga",
                email: "durga@example.com",
                city: "Hyderabad",
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        const mockedEmailExists =
            userEmailExistsForAnotherUser as jest.Mock;

        const mockedUpdateUser =
            updateUserById as jest.Mock;

        mockedEmailExists.mockResolvedValue(false);

        mockedUpdateUser.mockRejectedValue(
            new Error("Database error")
        );

        await editUser(req, res, next);

        expect(mockedEmailExists).toHaveBeenCalledWith(
            "durga@example.com",
            1
        );

        expect(mockedUpdateUser).toHaveBeenCalledWith({
            id: 1,
            name: "Durga",
            email: "durga@example.com",
            city: "Hyderabad",
        });

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to update user",
        });
    })

    it("should return 404 if updating user not found", async () => {
        const req = {
            body: {
                id: 1,
                name: "Durga",
                email: "durga@example.com",
                city: "Hyderabad",
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        const mockedEmailExists =
            userEmailExistsForAnotherUser as jest.Mock;

        const mockedUpdateUser =
            updateUserById as jest.Mock;

        mockedEmailExists.mockResolvedValue(false);

        mockedUpdateUser.mockResolvedValue(
            null
        );

        await editUser(req, res, next);

        expect(mockedEmailExists).toHaveBeenCalledWith(
            "durga@example.com",
            1
        );

        expect(mockedUpdateUser).toHaveBeenCalledWith({
            id: 1,
            name: "Durga",
            email: "durga@example.com",
            city: "Hyderabad",
        });

        expect(res.status).toHaveBeenCalledWith(404);

        expect(res.json).toHaveBeenCalledWith({
            error: "User not found",
        });
    })

    it("should return 400 if email  exists", async () => {
        const req = {
            body: {
                id: 1,
                name: "Durga",
                email: "durga@example.com",
                city: "Hyderabad",
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        const mockedEmailExists =
            userEmailExistsForAnotherUser as jest.Mock;


        mockedEmailExists.mockResolvedValue(true);


        await editUser(req, res, next);

        expect(mockedEmailExists).toHaveBeenCalledWith(
            "durga@example.com",
            1
        );
        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: "Email already exists",
        });
    })

    it("should return updated user successfully", async () => {
        const req = {
            body: {
                id: 1,
                name: "Durga",
                email: "durga@example.com",
                city: "Hyderabad",
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockedEmailExists =
            userEmailExistsForAnotherUser as jest.Mock;

        const mockedUpdateUser =
            updateUserById as jest.Mock;

        const updatedUser = {
            id: 1,
            name: "Durga",
            email: "durga@example.com",
            city: "Hyderabad",
        };

        mockedEmailExists.mockResolvedValue(false);
        mockedUpdateUser.mockResolvedValue(updatedUser);

        const next = jest.fn()
        await editUser(req, res, next);

        expect(mockedEmailExists).toHaveBeenCalledWith(
            "durga@example.com",
            1
        );

        expect(mockedUpdateUser).toHaveBeenCalledWith({
            id: 1,
            name: "Durga",
            email: "durga@example.com",
            city: "Hyderabad",
        });

        expect(res.json).toHaveBeenCalledWith(updatedUser);
    });
})

describe('validate create user', () => {
    it('should return 400 when user fields are invalid', async () => {
        const req = {
            body: {
                name: 'test',
                email: '',
                city: 'test'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        await createUser(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Name, email, and city are required'
        });

        expect(createUserWithEmailCheck).not.toHaveBeenCalled();
    });
    it("should return 400,if email alreday exists", async () => {
        const createUserCheck = createUserWithEmailCheck as jest.Mock;

        createUserCheck.mockResolvedValue({ kind: 'email-exists' })
        const req = {
            body: {
                name: 'test',
                email: 'test@gmail.com',
                city: 'test'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn()

        await createUser(req, res, next)

        expect(createUserCheck).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@gmail.com',
            city: 'test'
        })
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' })

    })
    it("should return 500.if db throws an error", async () => {

        const createUserCheck = createUserWithEmailCheck as jest.Mock;

        createUserCheck.mockRejectedValue(new Error("database error"))

        const req = {
            body: {
                name: 'test',
                email: 'test@gmail.com',
                city: 'test'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn()

        await createUser(req, res, next)

        expect(createUserCheck).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@gmail.com',
            city: 'test'
        })
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create user' })
    })
    it("Should return 201", async () => {
        const createUserCheck = createUserWithEmailCheck as jest.Mock;
        const user = {
            name: 'test',
            email: 'test@gmail.com',
            city: 'test'
        }
        createUserCheck.mockResolvedValue({ kind: 'created', user })

        const req = {
            body: user
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        } as unknown as Response;

        const next = jest.fn()

        await createUser(req, res, next)

        expect(createUserCheck).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@gmail.com',
            city: 'test'
        })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            name: 'test',
            email: 'test@gmail.com',
            city: 'test'
        })
    })
})

describe("validate delete user", () => {

    it('should return 400 when user ID is invalid', async () => {
        const req = {
            body: {
                id: -1,
                name: 'test',
                email: 'test@gmail.com',
                city: 'Tuni'
            }
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as unknown as Response;

        const next = jest.fn();

        await editUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid Id '
        });

        expect(deleteUserById).not.toHaveBeenCalled();
    });
    it("should return 500", async () => {
        const req = {
            params: {
                id: "1"
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockedDeleteExists =
            deleteUserById as jest.Mock;



        mockedDeleteExists.mockRejectedValue(new Error("gdscsxsdasc"));

        const next = jest.fn()
        await deleteUser(req, res, next);

        expect(mockedDeleteExists).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({ error: "Failed   to delete  user" });
    });
    it("should return 404", async () => {
        const req = {
            params: {
                id: "1"
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockedDeleteExists =
            deleteUserById as jest.Mock;



        mockedDeleteExists.mockResolvedValue(false);

        const next = jest.fn()
        await deleteUser(req, res, next);

        expect(mockedDeleteExists).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });
    it("should return 200", async () => {
        const req = {
            params: {
                id: '1'
            },
        } as unknown as Request;

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as unknown as Response;

        const mockedDeleteExists =
            deleteUserById as jest.Mock;



        mockedDeleteExists.mockResolvedValue(true);

        const next = jest.fn()
        await deleteUser(req, res, next);

        expect(mockedDeleteExists).toHaveBeenCalledWith(1);
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });
})