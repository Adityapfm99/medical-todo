import pool from "../config/database";

const seedUsers = async () => {
    const query = `
        INSERT INTO users (name, email, password, role, doctor_number)
        VALUES
            ('Dr. John Doe', 'john.doe@example.com', 'hashedpassword123', 'Doctor', 'D12345'),
            ('Dr. Jane Smith', 'jane.smith@example.com', 'hashedpassword456', 'Doctor', 'D12346'),
            ('Nurse Alice', 'alice@example.com', 'hashedpassword789', 'Nurse', NULL),
            ('Secretary Bob', 'bob@example.com', 'hashedpassword321', 'Secretary', NULL)
        ON CONFLICT (email) DO NOTHING;
    `;

    try {
        await pool.query(query);
        console.log("Users seeded successfully.");
    } catch (error) {
        console.error("Error seeding users:", error);
    } finally {
        await pool.end();
    }
};

seedUsers();
