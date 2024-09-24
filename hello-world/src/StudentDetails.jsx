import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './StudentDetails.css';
import StudentModifyOverlay from './components/StudentModifyOverlay'; // Import the overlay component
import axios from 'axios'; // Import axios for making API requests

function StudentDetails() {
  const location = useLocation();
  const [students, setStudents] = useState(location.state?.students || []);
  const department = location.state?.department || 'All Departments';
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Function to fetch students from the server
    const fetchStudents = async () => {
      try {
        const response = await axios.get('/student-details'); // Adjust the endpoint if needed
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudents();
  }, []);

  const handleModify = (student) => {
    setSelectedStudent(student);
  };

  const handleSave = async (updatedStudent) => {
    try {
      // Make an API call to update student details
      const response = await axios.put('/update/student', updatedStudent);
      console.log(response.data.message); // Handle success message

      // Fetch updated student data
      const updatedStudents = students.map((student) =>
        student.RegisterNumber === updatedStudent.RegisterNumber ? updatedStudent : student
      );
      setStudents(updatedStudents); // Update state with modified student

      setSelectedStudent(null); // Close the overlay
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDelete = async (registerNumber) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // Make an API call to delete student details
        const response = await axios.delete(`/delete/student/${registerNumber}`);
        console.log(response.data.message); // Handle success message

        // Remove deleted student from state
        const updatedStudents = students.filter(student => student.RegisterNumber !== registerNumber);
        setStudents(updatedStudents);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  const handleClose = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="student-details-container">
      <h1>{department} - Student Details</h1>
      {students.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Register Number</th>
              <th>Name</th>
              <th>CGPA</th>
              <th>Choice 1</th>
              <th>Choice 2</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.RegisterNumber}>
                <td>{student.RegisterNumber}</td>
                <td>{student.name}</td>
                <td>{student.CGPA}</td>
                <td>{student.Choice1}</td>
                <td>{student.Choice2}</td>
                <td>
                  <button
                    className="modify-button"
                    onClick={() => handleModify(student)}
                  >
                    Modify
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(student.RegisterNumber)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No student data available.</p>
      )}

      {selectedStudent && (
        <StudentModifyOverlay
          student={selectedStudent}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default StudentDetails;
