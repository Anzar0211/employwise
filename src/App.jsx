import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import UserCard from './components/UserCard';

const App = () => {
  const token = localStorage.getItem('token'); 

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/users" /> : <Login />} />
        <Route path="/users" element={token ? <UserList /> : <Navigate to="/" />} />
        <Route path="/edit/:id" element={token ? <EditUser /> : <Navigate to="/" />} />
        <Route path="/user/:id" element={token ? <UserCard /> : <Navigate to="/" />} />
        <Route path="*" element={token ? <Navigate to="/users" /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;