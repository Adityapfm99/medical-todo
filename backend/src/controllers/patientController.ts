import { Request, Response } from "express";
import * as patientService from "../services/patientService";

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { associatedDoctors } = req.body;

    // Validate associatedDoctors
    if (!Array.isArray(associatedDoctors)) {
      res.status(400).json({ error: "Invalid input: 'associatedDoctors' must be an array." });
      return; // Ensure no further execution
    }

    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (error: any) {
    console.error("Create Patient Error:", error.message);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await patientService.getAllPatients();
    res.status(200).json(patients);
  } catch (error: any) {
    console.error("Get All Patients Error:", error); // Log the error
    res.status(500).json({ error: error.message });
  }

};
