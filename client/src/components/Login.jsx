import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [values, setValues] = React.useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', values, { withCredentials: true });
      console.log(response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-blue-900">
      <div className="w-96 p-6 shadow-lg bg-white rounded-md">
        <h1 className="text-3xl block text-center font-semibold">
          <i className="fa-solid fa-user"></i> Login
        </h1>
        <hr className="mt-3" />
        <form onSubmit={handleSubmit}>
          <div className="mt-3">
            <label htmlFor="username" className="block text-base mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={values.username}
              onChange={handleChange}
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter Username..."
            />
          </div>
          <div className="mt-3">
            <label htmlFor="password" className="block text-base mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:border-gray-600"
              placeholder="Enter Password..."
            />
          </div>
          <div className="mt-5">
            <button
              type="submit"
              className="border-2 border-blue-800 bg-blue-800 text-white py-1 w-full rounded-md hover:bg-blue-300 hover:text-blue-800 font-semibold"
            >
              <i className="fa-solid fa-right-to-bracket"></i>&nbsp;&nbsp;Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
