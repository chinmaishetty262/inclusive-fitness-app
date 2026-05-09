import React, { useState,useEffect } from 'react';

import { Button, Form, Alert } from 'react-bootstrap';
import axiosInstance from './axiosInstance';
import { Link } from 'react-router-dom';

const Login = ({ onLogin }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
  const authError = localStorage.getItem("authError");

  if (authError) {
    setError(authError);
    localStorage.removeItem("authError");
  }
}, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        '/api/auth/login',
        {
          email,
          password
        }
      );

      if (response.status === 200) {

        const token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        const token1 = localStorage.getItem("token");
        const payload = JSON.parse(atob(token1.split('.')[1]));
        console.log(payload);
        onLogin(email);

      }

    } catch(err){
   console.log(err.response.data.message);
   setError(err.response?.data?.message || "Login failed");
}
  };
  

  return (
    <div className="login-container">

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleLogin}>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button type="submit" style={{ marginTop: '20px' }}>
          Login
        </Button>

      </Form>

      <p className="mt-3">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>

    </div>
  );
};

export default Login;