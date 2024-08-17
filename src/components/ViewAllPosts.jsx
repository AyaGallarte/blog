import { useState, useEffect, useContext } from 'react';
//import AdminView from '../components/AdminView';
import UserView from '../pages/UserView';
import UserContext from '../context/UserContext';
import { useProgress } from '../context/ProgressContext';
import ProgressBar from '../components/ProgressBar';

export default function ViewAllPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const { user } = useContext(UserContext);
    const { startProgress, closeModal, show, progress } = useProgress();

    const fetchData = async () => {
        setLoading(true); // Start loading

        let fetchUrl = "https://blog-server-nhh1.onrender.com/posts/getPosts";

        try {
            const response = await fetch(fetchUrl, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.message === "No posts found") {
                setPosts([]);
            } else if (data.posts) {
                setPosts(data.posts);
            } else {
                console.error("Unexpected response structure:", data);
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setPosts([]);
        } finally {
            closeModal();
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        startProgress();

        const timer = setTimeout(() => {
            fetchData().finally(() => {
                closeModal(); // Close the progress bar after fetching data
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, []); // Empty dependency array to ensure it only runs on the initial load

    return (
        <>
            {loading && show && <ProgressBar progress={progress} />} {/* Show progress bar only during loading */}
            {user.isAdmin
                ? <AdminView posts={posts} fetchData={fetchData} />
                : <UserView posts={posts} fetchData={fetchData} />
            }
        </>
    );
}