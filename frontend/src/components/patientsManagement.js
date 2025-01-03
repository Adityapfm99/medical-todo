import React, { useState, useEffect } from "react";
import { getUsers, createPatient, getAllPatients } from "../services/api";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "Male",
    associatedDoctors: [],
    email: "",
  });
  const [search, setSearch] = useState("");
  const [isPatientListCollapsed, setIsPatientListCollapsed] = useState(true);
  const [isCreatePatientCollapsed, setIsCreatePatientCollapsed] = useState(false); // Separate collapse for form
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getUsers();
      setDoctors(response.data.filter((user) => user.role === "Doctor"));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await getAllPatients();
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoctorChange = (e) => {
    const selectedDoctors = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setForm((prev) => ({ ...prev, associatedDoctors: selectedDoctors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(form);
      fetchPatients();
      setForm({ name: "", age: "", gender: "Male", associatedDoctors: [], email: "" });
      setSuccessMessage("Patient created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    const filtered = patients.filter((patient) =>
      patient.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  return (
    <div className="patient-management-container">
      <h2>Patient Management</h2>

      {/* Collapsible Create Patient Form */}
      <div className="collapsible-container">
        <h3
          onClick={() => setIsCreatePatientCollapsed((prev) => !prev)}
          className="collapsible-header"
        >
          Create Patient {isCreatePatientCollapsed ? "▼" : "▲"}
        </h3>
        {!isCreatePatientCollapsed && (
          <div className="collapsible-content">
            <form onSubmit={handleSubmit} className="patient-form">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Age:
                <input
                  type="number"
                  name="age"
                  value={form.age}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Gender:
                <select name="gender" value={form.gender} onChange={handleInputChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <label>
                Associated Doctors:
                <select
                  multiple
                  value={form.associatedDoctors}
                  onChange={handleDoctorChange}
                  required
                >
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.role})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleInputChange}
                />
              </label>
              <button
                type="submit"
                disabled={!form.name || !form.age || form.associatedDoctors.length === 0}
              >
                Create Patient
              </button>
            </form>
            {successMessage && <div className="success-message">{successMessage}</div>}
          </div>
        )}
      </div>

      {/* Collapsible Patient List */}
      <div className="collapsible-container">
        <h3
          onClick={() => setIsPatientListCollapsed((prev) => !prev)}
          className="collapsible-header"
        >
          Patient List {isPatientListCollapsed ? "▼" : "▲"}
        </h3>
        {!isPatientListCollapsed && (
          <div className="collapsible-content">
            <div className="search-container">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search patients by name"
                className="search-input"
              />
            </div>
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Associated Doctors</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.email || "N/A"}</td>
                    <td>
                      {patient.associated_doctors && patient.associated_doctors.length > 0
                        ? patient.associated_doctors.map((doc) => `${doc.name} (${doc.id})`).join(", ")
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;
