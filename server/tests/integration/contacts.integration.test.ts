//i have to implement integration test for my get route
//i have to trigger http request - i can do it using supertest
import request from 'supertest';
import app from '../../src/app';
import pool from '../../src/config/db';

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  await pool.query('TRUNCATE TABLE contacts RESTART IDENTITY CASCADE');
});

describe("validate get contacts flow", () => {

  it('should return contacts successfully', async () => {
    await pool.query(
      `INSERT INTO contacts (name, email, city)
     VALUES ($1, $2, $3)`,
      ["test", "test@gmail.com", "test"]
    );
    const response = await request(app).get('/getUserData');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: 1,
      name: 'test',
      email: 'test@gmail.com',
      city: 'test'
    });
  });
  it("should return 500", async () => {
    jest.spyOn(pool, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error('Database error')));
    const response = await request(app).get('/getUserData')
    expect(response.status).toBe(500)
    expect(response.text).toBe('Internal Server Error')
  })
})

describe("validate create userflow", () => {
  test("should validate input fields missing", async () => {
    //first step is call the server to trigger http call
    const response = await request(app)
      .post('/postUserData')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        // city is missing
      });
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Name, email, and city are required',
    })
  })
  test("should validate Failed to create user", async () => {

    await pool.query(
      `INSERT INTO contacts (name, email, city)
     VALUES ($1, $2, $3)`,
      ["test", "test@gmail.com", "test"]
    );

    const response = await request(app)
      .post('/postUserData')
      .send({
        name: 'Test User',
        email: 'test@gmail.com',
        city: 'test'
      })
    //how can i provide servcie is called correctly
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Email already exists' })
  })
  test("should validate user craeted with 500", async () => {
    await pool.query(
      `INSERT INTO contacts(name,email,city)
      VALUES($1,$2,$3)`,
      ["test", "test@gmail.com", "test"]
    )

    jest.spyOn(pool, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error('Failed to create user')));
    const response = await request(app)
      .post('/postUserData')
      .send({
        name: 'Test User',
        email: 'test@gmail.com',
        city: 'test'
      })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Failed to create user' })

  })
  test("should validate user created with 201", async () => {
    // await pool.query(
    //   `INSERT INTO contacts(name,email,city)
    //   VALUES($1,$2,$3)`
    //   , ["test", "test@gmail.com", "test"]
    // )
    const response = await request(app)
      .post('/postUserData')
      .send({
        name: 'test',
        email: 'test@gmail.com',
        city: 'test'
      })
    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      name: 'test',
      email: 'test@gmail.com',
      city: 'test',
    });
  })
})

describe("validate edit user", () => {
  test("should validate input fields missing 400", async () => {
    //first step is call the server to trigger http call
    const response = await request(app)
      .put('/putUserData')
      .send({
        name: 'Test',
        email: 'test@example.com',
      });
    expect(response.status).toBe(400)
    expect(response.body).toEqual({
      error: 'Name, email, and city are required',
    })
  })
  test("should validate invlaid Id 400", async () => {
    const response = await request(app)
      .put('/putUserData')
      .send({
        id: "-1",
        name: 'test',
        email: 'test@example.com',
        city: "test"
      })
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: "Invalid Id "
    })
  })

  test("should validate user exists  400", async () => {
    await pool.query(
      `INSERT INTO contacts (name, email, city)
     VALUES ($1, $2, $3)
      RETURNING id`,
      ["test", "test@gmail.com", "test"]
    );

    const result1 = await pool.query(
      `INSERT INTO contacts (name, email, city)
     VALUES ($1, $2, $3)
      RETURNING id`,
      ["test", "test1@gmail.com", "test"]
    );

    const response = await request(app)
      .put('/putUserData')
      .send({
        id: result1.rows[0].id,
        name: 'Test User',
        email: 'test@gmail.com',
        city: 'test'
      })
    //how can i provide servcie is called correctly
    expect(response.status).toBe(400)
    expect(response.body).toEqual({ error: 'Email already exists' })
  })

  test("should validate user not found 404 ", async () => {
    const res = await pool.query(
      `INSERT INTO contacts (name, email, city)
     VALUES ($1, $2, $3)
       RETURNING id`,
      ["test", "test@gmail.com", "test"]
    );

    const response = await request(app)
      .put('/putUserData')
      .send({
        id: 99999,
        name: 'Test User',
        email: 'test1@gmail.com',
        city: 'test'
      })
    //how can i provide servcie is called correctly
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'User not found' })
  })

  test("should validate user updated with 500", async () => {
    await pool.query(
      `INSERT INTO contacts(name,email,city)
      VALUES($1,$2,$3)
      RETURNING id`,
      ["test", "test@gmail.com", "test"]
    )

    jest.spyOn(pool, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error('Failed to create user')));
    const response = await request(app)
      .put('/putUserData')
      .send({
        id: 1,
        name: 'Test User',
        email: 'test@gmail.com',
        city: 'test'
      })

    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Failed to update user' })

  })
  test("validate updated 200", async () => {
    const res = await pool.query(`INSERT INTO contacts(name,email,city)
      VALUES($1,$2,$3)
      RETURNING id`,
      ["test", "test@gmail.com", "test"]
    )
    const response = await request(app)
      .put('/putUserData')
      .send({
        id: res.rows[0].id,
        name: 'test',
        email: 'test@gmail.com',
        city: 'test'
      })
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      name: 'test',
      email: 'test@gmail.com',
      city: 'test',
    });
  })
})

describe('validate delete user', () => {
  it("validate invalid id? 400", async () => {
    const response = await request(app)
      .delete('/deleteUserData/-1')
    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      error: "Invalid Id "
    })
  })
  it("validate delete user not found 404", async () => {
    //if i have to validate user not found empty tets data base is fine
    const response = await request(app)
      .delete('/deleteUserData/1')

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({ error: 'User not found' })
    //1 user wont be presnet as test db is empty
  })
  it("validate db error? 500", async () => {
    const res = await pool.query(`
      INSERT INTO contacts(name,email,city)
      VALUES ($1,$2,$3)
      RETURNING id`,
      ["test", "test@gmail.com", "test"]
    )
    //i have inserted test record so it should not fail in invalid id or user not found case
    //id 1 cannot be guaranted
    //use res.rows[0].id
    jest.spyOn(pool, 'query')
      .mockImplementationOnce(() => Promise.reject(new Error("Failed   to delete  user")))

    const response = await request(app)
      .delete(`/deleteUserData/${res.rows[0].id}`)


    expect(response.status).toBe(500)
    expect(response.body).toMatchObject({ error: "Failed   to delete  user" })
  })
  it("validate user deleted successfully ? 200", async () => {
    const res = await pool.query(`
      INSERT INTO contacts(name,email,city)
      VALUES ($1,$2,$3)
      RETURNING id`,
      ["test", "test@gmail.com", "test"]
    )

    const response = await request(app)
      .delete(`/deleteUserData/${res.rows[0].id}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({ message: 'User deleted successfully' })
  })
})
