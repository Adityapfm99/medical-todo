import express from "express";
import * as patientController from "../controllers/patientController";

const router = express.Router();

// Route to create a patient
router.post("/", patientController.createPatient);

// Route to get all patients
router.get("/", patientController.getAllPatients);

export default router;
