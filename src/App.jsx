import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Teachers from './components/Teachers';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage'; // Agar ro'yxatdan o'tish sahifasi kerak bo'lsa

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} /> {/* Agar ro'yxatdan o'tish sahifasi kerak bo'lsa */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;
