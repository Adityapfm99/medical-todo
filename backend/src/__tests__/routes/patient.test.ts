import request from 'supertest';
import app from '../../app'; // Import your Express app
import pool from '../../../src/config/database'; // Import your database connection

// Mock data
const mockPatient = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 30,
  gender: 'Male',
  associated_doctors: [1, 2],
};


describe('Patients API', () => {
  beforeAll(async () => {
    // Set up the test database
    await pool.query(`
     CREATE TABLE patients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        age INTEGER NOT NULL,
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
        associated_doctors INTEGER[] NOT NULL, -- Array of doctor IDs from users table
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);
  });

  beforeEach(async () => {
    // Clear the patients table before each test
    await pool.query('TRUNCATE TABLE patients RESTART IDENTITY CASCADE;');
  });

  afterAll(async () => {
    // Clean up the test database
    await pool.query('DROP TABLE IF EXISTS patients CASCADE;');
    await pool.end();
  });

  it('should create a new patient', async () => {
    const response = await request(app).post('/api/patients').send(mockPatient);
    console.log(response.body); // Log the response for debugging
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(mockPatient.name);
    expect(response.body.email).toBe(mockPatient.email);
  });
  
  it('should return all patients', async () => {
    await request(app).post('/api/patients').send(mockPatient);
  
    const response = await request(app).get('/api/patients');
    console.log("Get All Patients Response:", response.body); // Debug response
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe(mockPatient.name);
    expect(response.body[0].email).toBe(mockPatient.email);
  });
});