import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Honors from './components/Honors';
import StudentDetails from './StudentDetails';
import AdminDatabase from './components/AdminDatabase';
import Success from './components/Success';
import DatabaseTables from './components/DatabaseTables';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/honors" element={<Honors />} />
        <Route path="/student-details" element={<StudentDetails />} />
        <Route path="/admindatabase" element={<AdminDatabase />} />
        <Route path='databasetables' element={<DatabaseTables/>}/>
        <Route path="/success" element={<Success />} />
        <Route path="/admin/tables" element={<DatabaseTables />} />
      </Routes>
    </Router>
  );
}

export default App;
