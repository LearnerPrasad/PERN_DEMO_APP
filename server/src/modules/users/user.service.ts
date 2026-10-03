import pool from '../../config/db';

type UserFields = {
    name: string;
    email: string;
    city: string;
};

export const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM users');
    return result.rows
}
export const getUserExists = async (normalisedEmail: unknown) => {
    const result = await pool.query('SELECt email FROM users WHERE email = $1', [normalisedEmail]);
    return result.rows.length;
}
export const insertUser = async ({ name, email, city }: UserFields) => {
    const result = await pool.query('INSERT INTO users(name, email, city) VALUES ($1, $2, $3) RETURNING *', [name, email, city]);
    return result.rows[0];
}

export const createUserWithEmailCheck = async (input: UserFields) => {
    const email = input.email.trim();

    if (await getUserExists(email)) {
        return { kind: 'email-exists' } as const;
    }

    const user = await insertUser({ ...input, email });
    return { kind: 'created', user } as const;
}

export const userEmailExistsForAnotherUser = async (email: string, id: number) => {
    const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id <> $2',
        [email, id]
    );
    return result.rows.length > 0;
}

export const updateUserById = async ({ id, name, email, city }: UserFields & { id: number }) => {
    const result = await pool.query(
        `UPDATE users
         SET name = $1, email = $2, city = $3
         WHERE id = $4
         RETURNING *`,
        [name, email, city, id]
    );
    return result.rows[0] ?? null;
}

export const deleteUserById = async (id: number) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
    );
    return result.rows.length > 0;
}