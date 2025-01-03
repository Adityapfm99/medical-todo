export interface Patient {
    id: number; // Unique identifier for the patient
    name: string; // Name of the patient
    age: number; // Age of the patient
    gender: 'Male' | 'Female' | 'Other'; // Gender, restricted to valid values
    associated_doctors: number[]; // Array of doctor IDs responsible for the patient
    email?: string; // Optional email field for patient contact
    created_at?: string; // Optional timestamp when the patient record was created
  }
  