import pool from "../config/database";

// Create a patient
export const createPatient = async (data: {
  name: string;
  age: number;
  gender: string;
  associatedDoctors: number[];
  email?: string;
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Destructure and map input data
    const { name, age, gender, associatedDoctors: associated_doctors, email } = data;

    // Validate associated_doctors
    if (!Array.isArray(associated_doctors)) {
      throw new Error("Invalid input: 'associatedDoctors' must be an array.");
    }

    // Convert array to PostgreSQL array format
    const associatedDoctorsPGArray = `{${associated_doctors.join(',')}}`;

    const query = `
      INSERT INTO patients (name, age, gender, associated_doctors, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [name, age, gender, associatedDoctorsPGArray, email || null];

    console.log("Query:", query);
    console.log("Values:", values);

    const result = await client.query(query, values);

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    if (error instanceof Error) {
      console.error("Error creating patient:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  } finally {
    client.release();
  }
};
// Get a patient by ID
export const getPatientById = async (id: number) => {
  const query = `
    SELECT p.*,
           COALESCE(
             json_agg(json_build_object('id', u.id, 'name', u.name)) FILTER (WHERE u.id IS NOT NULL),
             '[]'
           ) AS associated_doctors
    FROM patients p
    LEFT JOIN patient_doctors pd ON p.id = pd.patient_id
    LEFT JOIN users u ON pd.doctor_id = u.id
    WHERE p.id = $1
    GROUP BY p.id;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Update a patient
export const updatePatient = async (
  id: number,
  data: { name: string; age: number; gender: string; associated_doctors: number[]; email?: string }
) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const query = `
      UPDATE patients
      SET name = $1, age = $2, gender = $3, email = $4
      WHERE id = $5
      RETURNING *;
    `;
    const values = [data.name, data.age, data.gender, data.email || null, id];
    const patientResult = await client.query(query, values);

    const patient = patientResult.rows[0];

    // Clear existing doctor associations
    await client.query("DELETE FROM patient_doctors WHERE patient_id = $1;", [id]);

    // Add new doctor associations
    if (data.associated_doctors.length > 0) {
      const doctorQuery = `
        INSERT INTO patient_doctors (patient_id, doctor_id)
        VALUES ${data.associated_doctors.map((_, i) => `($1, $${i + 2})`).join(", ")};
      `;
      const doctorValues = [id, ...data.associated_doctors];
      await client.query(doctorQuery, doctorValues);
    }

    await client.query("COMMIT");
    return patient;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// Delete a patient
export const deletePatient = async (id: number) => {
  const query = "DELETE FROM patients WHERE id = $1 RETURNING *;";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Get all patients
export const getAllPatients = async () => {
  const query = `
    SELECT 
      p.id AS patient_id,
      p.name AS patient_name,
      p.age,
      p.gender,
      p.email,
      COALESCE(
        json_agg(
          json_build_object('id', u.id, 'name', u.name)
        ) FILTER (WHERE u.id IS NOT NULL), '[]'
      ) AS associated_doctors
    FROM 
      patients p
    LEFT JOIN 
      unnest(p.associated_doctors) AS doctor_id ON TRUE
    LEFT JOIN 
      users u ON u.id = doctor_id
    GROUP BY 
      p.id;
  `;

  const result = await pool.query(query);
  return result.rows;
};