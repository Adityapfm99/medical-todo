export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: "Doctor" | "Nurse" | "Secretary";
    doctor_number?: string;
  }
  