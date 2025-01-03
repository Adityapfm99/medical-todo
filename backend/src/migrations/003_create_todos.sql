CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,                    
    task TEXT NOT NULL,                     
    deadline TIMESTAMP NOT NULL,              
    patient_id INT REFERENCES patients(id) ON DELETE SET NULL, 
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE, 
    resources JSONB DEFAULT '[]'::jsonb,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);