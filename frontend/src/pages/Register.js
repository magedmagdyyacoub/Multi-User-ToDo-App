// src/pages/Register.js
import { useState } from "react";
import { register as registerApi } from "../api";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerApi(form);
      navigate("/login");
    } catch (err) {
      setErrorMsg("Registration failed. Please try again.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="username" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                name="username" 
                placeholder="Enter username" 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            <Form.Group id="email" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                placeholder="Enter email" 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            <Form.Group id="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                placeholder="Password" 
                onChange={handleChange} 
                required 
              />
            </Form.Group>
            <Button type="submit" className="w-100" variant="primary">Register</Button>
          </Form>
          <div className="w-100 text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Register;
