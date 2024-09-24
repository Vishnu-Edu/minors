// StudentModifyOverlay.js
import React, { useState } from 'react';
import './StudentModifyOverlay.css';

function StudentModifyOverlay({ student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    RegisterNumber: student.RegisterNumber,
    name: student.name,
    CGPA: student.CGPA,
    Choice1: student.Choice1,
    Choice2: student.Choice2,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <h2>Modify Student Details</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            CGPA:
            <input
              type="text"
              name="CGPA"
              value={formData.CGPA}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Choice 1:
            <input
              type="text"
              name="Choice1"
              value={formData.Choice1}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Choice 2:
            <input
              type="text"
              name="Choice2"
              value={formData.Choice2}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}

export default StudentModifyOverlay;
