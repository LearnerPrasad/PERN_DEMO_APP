import pool from '../config/db';

const seedContacts = async () => {
    try {
        // We'll insert test contacts here.

        let userId = 7;
        const cities = [
            'Hyderabad',
            'Bangalore',
            'Chennai',
            'Mumbai',
            'Pune'
        ];

        for (let i = 1; i <= 100; i++) {
            const name = `Test user${i}`;
            const email = `test${i}@gmail.com`;
            const city = cities[(i - 1) % cities.length];

            await pool.query(`INSERT INTO contacts(name,email,city,user_id)
                VALUES($1,$2,$3,$4)`, [name, email, city, userId])
        }

    } catch (error) {
        console.error('Error seeding contacts:', error);
    } finally {
        await pool.end();
    }
};

seedContacts();