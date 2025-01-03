import React, { useState, useEffect } from 'react';
import { getUsers, createPatient } from '../services/api';

const PatientForm = ({ onPatientCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    associated_doctors: [],
  });
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await getUsers();
      const doctorList = response.data.filter(user => user.role === 'Doctor');
      setDoctors(doctorList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDoctorSelection = (e) => {
    const selectedDoctors = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData({ ...formData, associated_doctors: selectedDoctors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPatient(formData);
      onPatientCreated();
      setFormData({
        name: '',
        age: '',
        gender: '',
        associated_doctors: [],
      });
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div className="form-card">
      <h2>Create Patients</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            id="age"
            placeholder="Patient Age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select name="gender" id="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="associated_doctors">Associated Doctors</label>
          <select
            name="associated_doctors"
            id="associated_doctors"
            multiple
            value={formData.associated_doctors}
            onChange={handleDoctorSelection}
          >
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} ({doctor.doctor_number})
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create Patient</button>
      </form>
    </div>
  );
};

export default PatientForm;
