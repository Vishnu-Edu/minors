import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Form.css';

function Honors() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerNumberFromState = location.state?.registerNumber || localStorage.getItem('registerNumber') || '';

  const [formData, setFormData] = useState({
    RegisterNumber: registerNumberFromState,
    name: '',
    CGPA: '',
    Choice1: '',
    Choice2: '',
  });
  const [error, setError] = useState('');
  const [filteredChoices, setFilteredChoices] = useState([]);

  useEffect(() => {
    if (registerNumberFromState) {
      setFilteredChoices(getChoices().filter((choice) => choice !== formData.Choice1));
    }
  }, [formData.Choice1, registerNumberFromState]);

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
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const responseData = await response.json();
        setFormData({
          RegisterNumber: '',
          name: '',
          CGPA: '',
          Choice1: '',
          Choice2: '',
        });
        // Navigate to Success page with success message
        navigate('/success', {
          state: {
            message: responseData.message || 'Congratulations! Form submitted successfully.',
          },
        });
      } else {
        const errorText = await response.text();
        setError(`Error submitting form: ${errorText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Error submitting form: ${error.message}`);
    }
  };

  const getChoices = () => {
    const registerNumber = formData.RegisterNumber;
    const pattern = /^2[1-9]pa1a(42|45|12|05)[a-zA-Z0-9]{2}$/i;
    if (pattern.test(registerNumber)) {
      if (/^2[1-9]pa1a(42|45)/i.test(registerNumber)) {
        return ['CIVIL', 'MECH', 'ECE', 'EEE'];
      } else if (/^2[1-9]pa1a(05|12)/i.test(registerNumber)) {
        return ['AIML', 'AIDS', 'CSBS', 'CIVIL', 'MECH', 'ECE', 'EEE'];
      }
    }
    return ['CSE', 'IT', 'AIML', 'AIDS', 'CSBS', 'CIVIL', 'MECH', 'ECE', 'EEE'];
  };

  const choices = getChoices();

  return (
    <div className="form-container">
      <h1>Minors Details</h1>
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
          {choices.map((choice) => (
            <label key={`Choice1.${choice}`} className="radio-option">
              <input
                type="radio"
                name="Choice1"
                value={choice}
                checked={formData.Choice1 === choice}
                onChange={handleChange}
                required
              />
              {choice}
            </label>
          ))}
        </fieldset>
        <fieldset>
          <legend>Choice 2 (Minors)</legend>
          {filteredChoices.map((choice) => (
            <label key={`Choice2.${choice}`} className="radio-option">
              <input
                type="radio"
                name="Choice2"
                value={choice}
                checked={formData.Choice2 === choice}
                onChange={handleChange}
                required
              />
              {choice}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {error && (
        <div className="error-message">
          <h2>{error}</h2>
        </div>
      )}
    </div>
  );
}

export default Honors;
