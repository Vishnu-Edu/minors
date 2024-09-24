import React, { useState } from 'react';
import './Form.css';

function Minors() {
  const [formData, setFormData] = useState({
    RegisterNumber: '',
    name: '',
    CGPA: '',
    Choice1: '',
    Choice2: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      RegisterNumber: formData.RegisterNumber,
      name: formData.name,
      CGPA: formData.CGPA,
      Choice1: formData.Choice1,
      Choice2: formData.Choice2,
    };

    try {
      const response = await fetch('https://sheetdb.io/api/v1/ydmk0q7s0d3af', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Form submitted successfully');
        setIsSubmitted(true);
        setFormData({
          RegisterNumber: '',
          name: '',
          CGPA: '',
          Choice1: '',
          Choice2: '',
        });
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      alert('Error submitting form');
    }
  };

  return (
    <div className="form-container">
      <h1>Minors  Details</h1>
      {isSubmitted ? (
        <div className="success-message">Thank you for submitting the form!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Register Number:
            <input
              type="text"
              name="RegisterNumber"
              value={formData.RegisterNumber}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Name of the Candidate:
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
          <fieldset>
            <legend>Choice 1 (Minors)</legend>
            {['CSE', 'AIML', 'AIDS', 'IT', 'ECE', 'EEE', 'CIVIL', 'MECH'].map((option) => (
              <label key={`Choice1.${option}`} className="radio-option">
                <input
                  type="radio"
                  name="Choice1"
                  value={option}
                  checked={formData.Choice1 === option}
                  onChange={handleChange}
                  required
                />
                {option}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Choice 1 (Minors)</legend>
            {['CSE', 'AIML', 'AIDS', 'IT', 'ECE', 'EEE', 'CIVIL', 'MECH'].map((option) => (
              <label key={`Choice1.${option}`} className="radio-option">
                <input
                  type="radio"
                  name="Choice1"
                  value={option}
                  checked={formData.Choice1 === option}
                  onChange={handleChange}
                  required
                />
                {option}
              </label>
            ))}
          </fieldset>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      )}
    </div>
  );
}

export default Minors;
