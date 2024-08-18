import { useState, useEffect, useContext } from 'react';
import { Form, Button, Col, Row, Container } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const { startProgress, closeModal } = useProgress();
    const navigate = useNavigate(); 

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);

    useEffect(() => {
        setIsActive(username !== '' && password !== '');
    }, [username, password]);

    const handleSubmit = (e) => {
        e.preventDefault();
        startProgress();

        setTimeout(() => {
            authenticate();
        }, 1000);
    };

    const authenticate = async () => {
        try {
            const response = await fetch('https://blog-server-nhh1.onrender.com/users/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            handleResponse(data);
        } catch (error) {
            console.error("Error during authentication:", error);
        } finally {
            closeModal();
        }
    };

    const handleResponse = (data) => {
        if (data.access) {
            localStorage.setItem('token', data.access);
            retrieveUserDetails(data.access);
            setUsername('');
            setPassword('');

            Swal.fire({
                title: "Login Successful",
                icon: "success",
                text: "You are now logged in.",
                showConfirmButton: false,
                timer: 1500
            }).then(() => navigate('/'));
        } else {
            const errorMessages = {
                "Username and password do not match": "Incorrect username or password.",
                "default": `${username} does not exist.`
            };

            Swal.fire({
                title: data.error === "Username and password do not match" ? "Login Failed" : "User Not Found",
                icon: "error",
                text: errorMessages[data.error] || errorMessages["default"]
            });
        }
    };

    const retrieveUserDetails = async (token) => {
        try {
            const response = await fetch('https://blog-server-nhh1.onrender.com/users/details', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            setUser({
                id: data.user._id,
                isAdmin: data.user.isAdmin
            });
        } catch (error) {
            console.error("Error retrieving user details:", error);
        }
    };

    return user.id ? (
        <Navigate to="/" />
    ) : (
        <div 
            className="login-container"
            role="dialog"
            aria-modal="true"
            aria-hidden={!isModalOpen}
            style={{ display: isModalOpen ? 'block' : 'none' }}
            inert>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <Form onSubmit={handleSubmit} className="login-form">
                            <h2 className="text-center">Login</h2>
                            <Form.Group>
                                <Form.Label>Username</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter username" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    placeholder="Enter password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>
                            <div className="login-button">
                                <Button variant={isActive ? "success" : "danger"} type="submit" disabled={!isActive}>
                                    Login
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
