import pool from '../../config/db';

type UserFields = {
    name: string;
    email: string;
    city: string;
    userId: number
};

export const getAllUsers = async (
    userId: number,
    queryParams: {
        searchTerm?: string;
        sortOption?: string;
        limit: string;
        page: string
    }
) => {
    const { searchTerm, sortOption, limit, page } = queryParams ?? {};
    console.log(searchTerm, sortOption, "test")

    const sortOptions: Record<string, string> = {
        'name-asc': 'name ASC',
        'name-desc': 'name DESC',
        'email-asc': 'email ASC',
        'email-desc': 'email DESC',
        'city-asc': 'city ASC',
        'city-desc': 'city DESC',
        'newest': 'created_at DESC',
        'oldest': 'created_at ASC'

    }

    let query = `SELECT * FROM contacts WHERE user_id = $1`;
    const values: (string | number)[] = [userId];

    if (searchTerm?.trim()) {
        values.push(`${searchTerm.trim()}%`);
        query += ` AND (name ILIKE $3 OR email ILIKE $3 OR city ILIKE $3)`;
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    const offset = (pageNumber - 1) * pageSize;

    if (sortOption && sortOptions[sortOption]) {
        query += ` ORDER BY ${sortOptions[sortOption]}`;
    }
    values.push(pageSize);
    query += ` LIMIT $${values.length}`;

    values.push(offset);
    query += ` OFFSET $${values.length}`;


    const countResult = await pool.query(`SELECT COUNT(*)  FROM contacts WHERE user_id = $1`, [userId])
    const result = await pool.query(query, values);
    return {
        data: result.rows,
        totalRecords: Number(countResult.rows[0].count)
    };
};
export const getUserExists = async (normalisedEmail: unknown) => {
    const result = await pool.query('SELECt email FROM contacts WHERE email = $1', [normalisedEmail]);
    return result.rows.length;
}
export const insertUser = async ({ name, email, city, userId }: UserFields) => {
    const result = await pool.query('INSERT INTO contacts(name, email, city,user_id) VALUES ($1, $2, $3,$4) RETURNING *', [name, email, city, userId]);
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

export const userEmailExistsForAnotherUser = async (email: string, id: number, userId: number) => {
    const result = await pool.query(
        'SELECT id FROM contacts WHERE email = $1 AND id <> $2 AND user_id = $3',
        [email, id, userId]
    );
    return result.rows.length > 0;
}

export const updateUserById = async ({ id, name, email, city, userId }: UserFields & { id: number }) => {
    const result = await pool.query(
        `UPDATE contacts
         SET name = $1, email = $2, city = $3
         WHERE id = $4 AND user_id = $5
         RETURNING *`,
        [name, email, city, id, userId]
    );
    return result.rows[0] ?? null;
}

export const deleteUserById = async (id: number, userId: number) => {
    const result = await pool.query(
        'DELETE FROM contacts WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
    return result.rows.length > 0;
}