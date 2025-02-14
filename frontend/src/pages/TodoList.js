// src/pages/TodoList.js
import { useEffect, useState, useContext } from "react";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "../api";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, ListGroup, Card, Row, Col, Alert } from "react-bootstrap";

const TodoList = () => {
  const { user, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTodos = async () => {
    try {
      const res = await getTodos(user.token);
      setTodos(res.data);
    } catch (err) {
      setErrorMsg("Failed to load todos.");
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      if (title.trim() === "") return;
      await addTodo(title, user.token);
      setTitle("");
      loadTodos();
    } catch (err) {
      setErrorMsg("Failed to add todo.");
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      await toggleTodo(id, user.token);
      loadTodos();
    } catch (err) {
      setErrorMsg("Failed to update todo.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id, user.token);
      loadTodos();
    } catch (err) {
      setErrorMsg("Failed to delete todo.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2>My Todos</h2>
        </Col>
        <Col className="text-end">
          <Button variant="outline-danger" onClick={logout}>
            Logout
          </Button>
        </Col>
      </Row>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleAddTodo} className="d-flex">
            <Form.Control
              type="text"
              placeholder="Add a new todo..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" className="ms-2">
              Add
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
            <span
              onClick={() => handleToggleTodo(todo.id)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {todo.title}
            </span>
            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTodo(todo.id)}>
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default TodoList;
