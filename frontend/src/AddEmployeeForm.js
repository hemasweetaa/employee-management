import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployeeForm.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    phone: '',
    department: '',
    dateOfJoining: '',
    role: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const departments = ['HR', 'Engineering', 'Marketing', 'Sales'];
  const navigate = useNavigate(); // Initialize navigate here

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'employeeId') {
      validateEmployeeId(e.target.value); // Validate employee ID on change
    }
  };

  const validateEmployeeId = (id) => {
    const idPattern = /^[0-9]{4}[A-Z]{2}$/; // Regex for 4 digits followed by 2 uppercase letters
    if (!idPattern.test(id)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        employeeId: 'Format: 4 digits , 2 letters',
      }));
    } else {
      setErrors((prevErrors) => {
        const { employeeId, ...rest } = prevErrors;
        return rest; // Remove employeeId error if the ID is valid
      });
    }
  };

  const handleManage = () => {
    navigate('/manage'); // Navigate to the Manage page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});

    try {
      const response = await axios.post('http://localhost:5000/add-employee', formData);

      // Display success message
      setMessage(response.data.message);

      // Clear the form if submission was successful
      setFormData({
        firstName: '',
        lastName: '',
        employeeId: '',
        email: '',
        phone: '',
        department: '',
        dateOfJoining: '',
        role: '',
      });
    } catch (error) {
      if (error.response?.data?.error) {
        setMessage('');
        setErrors({ global: error.response.data.error });
      } else {
        setMessage('An unexpected error occurred.');
      }
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      employeeId: '',
      email: '',
      phone: '',
      department: '',
      dateOfJoining: '',
      role: '',
    });
    setMessage('');
    setErrors({});
  };

  return (
    <div className="App">
      <h1 className="form-title">Employee Details</h1>
      <form className="employee-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">First Name:</label>
          <input
            className="form-input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Enter first name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Last Name:</label>
          <input
            className="form-input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Enter last name"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Employee ID:</label>
          <input
            className="form-input"
            type="text"
            name="employeeId"
            maxLength="6"
            value={formData.employeeId}
            onChange={handleChange}
            required
            placeholder="Enter Employee ID"
          />
          {errors.employeeId && <p className="error-message">{errors.employeeId}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number:</label>
          <input
            className="form-input"
            type="text"
            name="phone"
            pattern="\d{10}"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department:</label>
          <select
            className="form-input"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Date of Joining:</label>
          <input
            className="form-input"
            type="date"
            name="dateOfJoining"
            max={new Date().toISOString().split('T')[0]}
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            placeholder="Select date"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Role:</label>
          <input
            className="form-input"
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            placeholder="Enter role"
          />
        </div>

        <div className="form-buttons">
          <button className="form-submit" type="submit">
            Submit
          </button>
          <button
            className="form-manage"
            type="button"
            onClick={handleManage} // Navigate on click
          >
            Manage
          </button>
          <button className="form-reset" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>

      {errors.global && <p className="error-message">{errors.global}</p>}
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default App;
