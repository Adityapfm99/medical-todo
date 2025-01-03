import request from 'supertest';
import app from '../../app'; // Import your Express app
import * as patientService from '../../services/patientService'; // Mock patientService

jest.mock('../../services/patientService'); // Mock the entire service

const mockPatient = {
  name: 'John Doe',
  age: 30,
  gender: 'Male',
  associatedDoctors: [1, 2],
  email: 'john.doe@example.com',
};

const mockPatientResponse = {
  id: 1,
  ...mockPatient,
};

describe('Patient API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
  });

  describe('POST /api/patients', () => {
    it('should create a new patient', async () => {
      // Mock patientService.createPatient to return a successful response
      (patientService.createPatient as jest.Mock).mockResolvedValueOnce(mockPatientResponse);

      const response = await request(app).post('/api/patients').send(mockPatient);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body.name).toBe(mockPatient.name);
      expect(patientService.createPatient).toHaveBeenCalledWith(mockPatient);
    });

    it('should handle validation errors for associatedDoctors', async () => {
      // Test with invalid associatedDoctors
      const invalidPatient = { ...mockPatient, associatedDoctors: 'invalid' }; // Invalid: not an array
    
      const response = await request(app).post('/api/patients').send(invalidPatient);
    
      // Expect 400 Bad Request
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', "Invalid input: 'associatedDoctors' must be an array.");
    });
  });
  

  describe('GET /api/patients', () => {
    it('should return all patients', async () => {
      // Mock patientService.getAllPatients to return a list of patients
      (patientService.getAllPatients as jest.Mock).mockResolvedValueOnce([mockPatientResponse]);

      const response = await request(app).get('/api/patients');

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].name).toBe(mockPatient.name);
      expect(patientService.getAllPatients).toHaveBeenCalled();
    });

    it('should handle errors in getAllPatients', async () => {
      // Mock an error in patientService.getAllPatients
      (patientService.getAllPatients as jest.Mock).mockRejectedValueOnce(new Error('Database Error'));

      const response = await request(app).get('/api/patients');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Database Error');
    });
  });
});
