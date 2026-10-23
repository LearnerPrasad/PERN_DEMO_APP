import {
    getAllUsers,
    createUserWithEmailCheck,
    userEmailExistsForAnotherUser,
    updateUserById,
    deleteUserById
} from '../../../src/modules/contacts/contacts.service';
import { ValidateUserFields, ValidateUserId } from '../../../src/modules/contacts/contacts.validation'
import pool from '../../../src/config/db';

jest.mock('../../../src/config/db', () => ({
    __esModule: true,
    default: {
        query: jest.fn()
    }
}));

describe('getAllUsers', () => {
    it('should return all contacts', async () => {

        const mockedQuery = pool.query as jest.Mock;

        mockedQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    city: 'Tuni'
                }
            ]
        });

        const result = await getAllUsers();
        expect(result).toBeDefined();
    });
});

describe('ValidateCreateUser', () => {
    test('should return true when all fields are present', () => {
        const userInputs = {
            name: "test",
            email: "test@gmail.com",
            city: "test"
        };

        const result = ValidateUserFields(userInputs);
        expect(result).toBe(true);

    });
    test('should return false when required fields are missing', () => {
        const userInputs = {
            name: "test",
            email: "test@gmail",
            city: ""
        };

        const result = ValidateUserFields(userInputs);
        expect(result).toBe(false);
    });
    test('should create user when email does not exists', async () => {
        const mockedQuery = pool.query as jest.Mock;
        const user = {
            name: "test",
            email: "test@gmail",
            city: "test"
        };
        mockedQuery
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    name: 'test',
                    email: 'test@gmail.com',
                    city: 'test'
                }]
            });
        const result = await createUserWithEmailCheck(user)
        expect(result).toEqual({
            kind: 'created',
            user: {
                id: 1,
                name: 'test',
                email: 'test@gmail.com',
                city: 'test'
            }
        });

    });
    test('should reject when email already exists ', async () => {
        const mockedQuery = pool.query as jest.Mock;
        mockedQuery.mockResolvedValue({
            rows: [{
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                city: 'Tuni'
            }]
        })

        const result = await createUserWithEmailCheck({
            name: 'Test User',
            email: 'test@example.com',
            city: 'Tuni'
        })
        expect(result).toEqual({ kind: 'email-exists' })
    })
})

describe('validateEditUser', () => {
    // it('')//re-use test present in create for inputs validation
    it('should reject, if id is invalid', () => {
        //no db interference here
        //no api call
        //nothing to mock
        const id = -1;
        const result = ValidateUserId(id);
        expect(result).toBe(false)
    })
    it('should reject ,if email exists for another user', async () => {
        const mockedQuery = pool.query as jest.Mock;
        mockedQuery.mockResolvedValue({
            rows: [
                {
                    id: 2
                }
            ]
        })
        const id = 1;
        const email = 'test@gmail.com'
        const result = await userEmailExistsForAnotherUser(email, id);
        expect(result).toBe(true)
    })
    it('should update user', async () => {
        const mockedQuery = pool.query as jest.Mock;
        mockedQuery.mockResolvedValue({
            rows: [
                {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                    city: 'Tuni'
                }
            ]
        })
        const { id, name, email, city } = { id: 1, name: 'test', email: 'test@gmail.com', city: 'test' }
        const result = await updateUserById({ id, name, email, city });
        expect(result).toEqual({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            city: 'Tuni'
        })
    })
    it('should return null if user does not exist', async () => {
        const mockedQuery = pool.query as jest.Mock;

        mockedQuery.mockResolvedValue({
            rows: []
        });

        const result = await updateUserById({
            id: 1,
            name: 'Updated User',
            email: 'updated@gmail.com',
            city: 'Hyderabad'
        });

        expect(result).toBeNull();
    });

})

describe("deleteUser", () => {
    it("should reject false ,if id doesnot exists", async () => {
        const mockedQuery = pool.query as jest.Mock;
        mockedQuery.mockResolvedValue({
            rows: []
        });
        const id = 1;
        const result = await deleteUserById(id);
        expect(result).toBe(false)
    })
})