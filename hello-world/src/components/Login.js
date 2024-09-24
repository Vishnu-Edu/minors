import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import vit from './vit.jpeg';
import user from './user.png';
import finger from './finger.jpg';

function Login() {
  const navigate = useNavigate();
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [employeePassword, setEmployeePassword] = useState('');
  const [studentRegisterNumber, setStudentRegisterNumber] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [error, setError] = useState('');

  const validateRegisterNumber = (registerNumber) => {
    const re = /^2[1-9]pa1a[a-zA-Z0-9]{4}$/; // Validate register number format
    return re.test(String(registerNumber).toLowerCase());
  };

  const handleLogin = async (e, type) => {
    e.preventDefault();
    setError('');

    const email = type === 'employee' ? employeeEmail : '';
    const password = type === 'employee' ? employeePassword : '';
    const registerNumber = type === 'student' ? studentRegisterNumber : '';
    const studentPasswordInput = type === 'student' ? studentPassword : '';

    if (type === 'employee') {
      if (email === 'admin@gmail.com') {
        navigate('/admindatabase');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/employee/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();

        // Determine department based on email
        let department;
        if (/aiml.*hod/i.test(email)) {
          department = 'AIML';
        } else if (/civil.*hod/i.test(email)) {
          department = 'Civil';
        } else if (/aids.*hod/i.test(email)) {
          department = 'AIDS';
        } else if (/eee.*hod/i.test(email)) {
          department = 'EEE';
        } else if (/ece.*hod/i.test(email)) {
          department = 'ECE';
        } else if (/mech.*hod/i.test(email)) {
          department = 'Mechanical';
        } else if (/cse.*hod/i.test(email)) {
          department = 'CSE';
        } else if (/it.*hod/i.test(email)) {
          department = 'IT';
        } else if (/csbs.*hod/i.test(email)) {
          department = 'CSBS';
        } else {
          department = 'No Department';
        }

        // Redirect to StudentDetails with the data and department
        navigate('/student-details', { state: { students: data.students, department } });
      } catch (error) {
        console.error('Error:', error);
        setError(`Error logging in: ${error.message}`);
      }
    } else {
      if (!validateRegisterNumber(registerNumber)) {
        setError('Please enter a valid college register number.');
        return;
      }

      // Handle student login
      localStorage.setItem('registerNumber', registerNumber);
      navigate('/honors', { state: { registerNumber } });
    }
  };

  const handleOverlayClick = () => {
    setError(''); // Dismiss the error when clicking outside
  };

  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      <div className={`header ${error ? 'blur' : ''}`}>
        <img src={vit} alt="" className="vit" />
        <div className='info'> 
          <h1 id='h'>VISHNU INSTITUTE OF TECHNOLOGY</h1>
          <p className='pp'>Approved by AICTE, New Delhi | Affiliated to JNTUK <span className='line-break'></span>
            Vishnupur, Bhimavaram, West Godavari Dist. -534202 Ph : 08816 251333,250819 Fax:08816 250344<span className='line-break'></span>
            e-mail : info@vishnuit.in website : www.vishnuit.in
          </p>
        </div>
      </div>
      {error && (
        <div className="error-overlay" onClick={handleOverlayClick}>
          <div className="error-message">{error}</div>
        </div>
      )}
      <div className={`containers ${error ? 'blur' : ''}`}>
        <div className="contain">
          <form onSubmit={(e) => handleLogin(e, 'employee')}>
            <h1>Employee Login</h1>   
            <div className="input"> 
              <input 
                type="email" 
                name="email" 
                placeholder='Email'
                className='u'
                value={employeeEmail} 
                onChange={(e) => setEmployeeEmail(e.target.value)} 
                required 
              />
              <img src={user} alt="" className='user' />
              <img src={finger} alt="" className='finger' />
              <input 
                type="password" 
                name="password" 
                className='l' 
                placeholder='Password' 
                value={employeePassword} 
                onChange={(e) => setEmployeePassword(e.target.value)} 
                required 
              />
              <div className='rem'>
                <input type='checkbox' id='chk' />
                <p>Remember Me</p>
                <a href='#'><p id='f'>Forgot Password?</p></a> 
              </div>
              <button id='button'>Login</button>
            </div>
          </form>
        </div>
        <div className="contain">
          <form onSubmit={(e) => handleLogin(e, 'student')}>
            <h1>Student Login</h1>   
            <div className="input"> 
              <input 
                type="text" 
                name="registerNumber" 
                placeholder='Register Number' 
                className='u'
                value={studentRegisterNumber} 
                onChange={(e) => setStudentRegisterNumber(e.target.value)} 
                required 
              />
              <img src={user} alt="" className='use' />
              <img src={finger} alt="" className='fing' />
              <input 
                type="password" 
                name="password" 
                className='l' 
                placeholder='Password' 
                value={studentPassword} 
                onChange={(e) => setStudentPassword(e.target.value)} 
                required 
              />
              <div className='rem'>
                <input type='checkbox' id='chk' />
                <p>Remember Me</p>
                <a href='#'><p id='f'>Forgot Password?</p></a> 
              </div>
              <button id='button'>Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
