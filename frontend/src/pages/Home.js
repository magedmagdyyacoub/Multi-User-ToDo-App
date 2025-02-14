import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Button, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/todos");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

    return (
        <Container className="mt-5">
            {/* Login & Register Buttons */}
            <div className="d-flex justify-content-end">
                <Link to="/login">
                    <Button variant="primary" className="me-2">Login</Button>
                </Link>
                <Link to="/register">
                    <Button variant="secondary">Register</Button>
                </Link>
            </div>

            {/* Tasks List */}
            <h2 className="text-center mt-4">Tasks List</h2>
            <Card className="mt-3">
                <ListGroup variant="flush">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <ListGroup.Item key={task.id}>
                                <strong>{task.username}:</strong> {task.title}
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-center">No tasks available</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </Container>
    );
};

export default Home;
