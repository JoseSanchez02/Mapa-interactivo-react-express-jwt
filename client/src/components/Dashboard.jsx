import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-green-900">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-3xl block text-center font-semibold">
          Welcome to the Dashboard, {user.username}!
        </h1>
        <p className="text-center mt-4">This is your dashboard. Manage your resources here.</p>
      </div>
    </div>
  );
}

export default Dashboard;
