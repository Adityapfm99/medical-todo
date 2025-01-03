import pool from "../config/database";

const seedPatients = async () => {
  try {
    console.log("Seeding patients...");

    const query = `
      INSERT INTO patients (name, age, gender, associated_doctors, created_at)
      VALUES 
        ('John Doe', 35, 'Male', ARRAY[1, 2], NOW()),
        ('Jane Smith', 28, 'Female', ARRAY[2, 3], NOW()),
        ('Emily Davis', 45, 'Female', ARRAY[1, 3], NOW()),
        ('Michael Brown', 50, 'Male', ARRAY[2], NOW()),
        ('Chris Johnson', 40, 'Other', ARRAY[1, 2, 3], NOW())
      ON CONFLICT DO NOTHING;
    `;

    await pool.query(query);
    console.log("Patients seeded successfully!");
  } catch (error) {
    console.error("Error seeding patients:", error);
  } finally {
    await pool.end();
  }
};

seedPatients();
