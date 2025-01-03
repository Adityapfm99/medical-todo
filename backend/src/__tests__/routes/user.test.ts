import request from 'supertest';
import app from '../../app'; // Your Express app
import pool from '../../../src/config/database'; // Your database connection

// Mock data
const mockUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'securepassword',
  role: 'Doctor',
  doctor_number: 'D12345',
};

describe('Users API', () => {
  beforeAll(async () => {
    // Set up database schema
    await pool.query('DROP TABLE IF EXISTS todo_users, todos, users CASCADE;');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Secretary')),
          doctor_number VARCHAR(50) UNIQUE
      );
    `);
  });

  beforeEach(async () => {
    // Clear the database before each test
    await pool.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    // Clean up database and close the connection
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    await pool.end();
  });

  it('should create a new user', async () => {
    const response = await request(app).post('/api/users').send(mockUser);

    // Assertions for response
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(mockUser.email);

    // Verify the user was inserted in the database
    const dbResponse = await pool.query('SELECT * FROM users WHERE email = $1', [mockUser.email]);
    expect(dbResponse.rows.length).toBe(1);
    expect(dbResponse.rows[0].email).toBe(mockUser.email);
  });

  it('should return all users', async () => {
    await request(app).post('/api/users').send(mockUser);
    const response = await request(app).get('/api/users');

    // Assertions for response
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].email).toBe(mockUser.email);
  });
  it('should not create a user with a duplicate email', async () => {
    // Step 1: Create the first user
    const firstResponse = await request(app).post('/api/users').send(mockUser);
    expect(firstResponse.status).toBe(201); // Ensure the first user creation is successful
    expect(firstResponse.body).toHaveProperty('id');
    expect(firstResponse.body.email).toBe(mockUser.email);

    // Step 2: Attempt to create another user with the same email
    const duplicateResponse = await request(app).post('/api/users').send(mockUser);

    // Assertions for duplicate email
    expect(duplicateResponse.status).toBe(400); // Expect 400 Bad Request
    expect(duplicateResponse.body).toHaveProperty('message');
    expect(duplicateResponse.body.message).toContain('Duplicate email');
  });

  it("should validate required fields", async () => {
    // Create an invalid user with an empty email
    const invalidUser = { ...mockUser, email: "" };
  
    // Make a POST request to create a user
    const response = await request(app).post("/api/users").send(invalidUser);
  
    // Assertions
    expect(response.status).toBe(400); // Validation should fail with 400
    expect(response.body).toHaveProperty("message"); // Check for the presence of a message
    expect(response.body.message).toContain("Valid email is required"); // Check the error message content
  });
});
