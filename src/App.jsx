import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import AppNavbar from './components/AppNavbar';
import ProgressBar from './components/ProgressBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import ViewAllPosts from './components/ViewAllPosts';
import UserView from './pages/UserView';
import Post from './pages/Post';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  });

  function unsetUser() {
    localStorage.clear();
    sessionStorage.clear();
    setUser({
          id: null,
          isAdmin: null,
    });
  }

  const token = localStorage.getItem('token');

  useEffect(() => {
     if (token !== null){
          fetch('https://blog-server-nhh1.onrender.com/users/details', {
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if(typeof data !== 'undefined') {
        setUser({
          id: data.user._id,
          isAdmin: data.user.isAdmin
        });
        sessionStorage.setItem('token', data.token);
        } else {
          unsetUser();
        }
      });
    }
  }, [token]);

  useEffect(() => {
    console.log(user);
    console.log(localStorage);
  }, [user]);

  return (
    <UserProvider value={{ user, setUser, unsetUser }}>
      <ProgressProvider>
        <Router>
          <AppNavbar />
            <Container>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/viewAllPosts" element={<ViewAllPosts />} />
                <Route path="/userView" element={<UserView />} />
                <Route path="/posts/:postId" element={<Post />} />
              </Routes>
            </Container>
          </Router>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;

