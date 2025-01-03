import request from 'supertest';
import app from '../../app'; // Import your Express app
import pool from '../../../src/config/database'; // Import your database connection

// Mock data
const mockUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'securepassword',
  role: 'Doctor',
  doctor_number: 'D12345',
};

const mockTodo = {
  task: 'Review patient report',
  deadline: '2024-01-15T10:30:00Z',
};

describe('Todos API', () => {
  beforeAll(async () => {
    // Set up the test database
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Secretary')),
          doctor_number VARCHAR(50) UNIQUE
      );

      CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          task TEXT NOT NULL,
          deadline TIMESTAMP NOT NULL,
          created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS todo_users (
          todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          PRIMARY KEY (todo_id, user_id)
      );
    `);
  });

  beforeEach(async () => {
    // Clear the todos and users tables before each test
    await pool.query('TRUNCATE TABLE todo_users, todos, users RESTART IDENTITY CASCADE;');

    // Insert a mock user to use as the creator
    await pool.query(`
      INSERT INTO users (name, email, password, role, doctor_number)
      VALUES ($1, $2, $3, $4, $5);
    `, [mockUser.name, mockUser.email, mockUser.password, mockUser.role, mockUser.doctor_number]);
  });

  afterAll(async () => {
    // Clean up the test database
    await pool.query('DROP TABLE IF EXISTS todo_users, todos, users CASCADE;');
    await pool.end();
  });

  it('should create a new to-do', async () => {
    const response = await request(app).post('/todos').send({
      ...mockTodo,
      created_by: 1, // Assuming the inserted user ID is 1
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.task).toBe(mockTodo.task);
  });

  it('should return all to-dos', async () => {
    // Insert a mock to-do
    await request(app).post('/todos').send({
      ...mockTodo,
      created_by: 1, // Assuming the inserted user ID is 1
    });

    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].task).toBe(mockTodo.task);
  });
});
