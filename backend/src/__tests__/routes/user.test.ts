import request from "supertest";
import app from "../../app";
import pool from "../../../src/config/database";

jest.mock("../../../src/config/database");

const mockUser = {
  name: "Test Use123r",
  email: "testuse3r@example.com",
  password: "securepasswor123",
  role: "Doctor",
  doctor_number: "D13233345",
};

jest.mock("bcrypt", () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed-${password}`)),
}));

describe("Users API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user", async () => {
    (pool.query as jest.Mock)
      .mockResolvedValueOnce({ rows: [] }) // Duplicate check
      .mockResolvedValueOnce({ rows: [{ id: 1, ...mockUser, password: "hashed-securepassword" }] }); // Insert user

    const response = await request(app).post("/api/users").send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body.email).toBe(mockUser.email);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("SELECT * FROM users WHERE email"),
      [mockUser.email]
    );
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO users"),
      expect.arrayContaining([mockUser.name, mockUser.email, expect.any(String), mockUser.role, mockUser.doctor_number])
    );
  });

  it("should return all users", async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUser] });

    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toMatchObject({
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    });
  });

});
