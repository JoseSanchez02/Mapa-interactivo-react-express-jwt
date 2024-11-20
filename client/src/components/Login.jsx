import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [values, setValues] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  // Verifica si hay un token válido cuando se carga el componente
  useEffect(() => {
    const checkToken = async () => {
      try {
        // Hacemos una solicitud al backend para verificar el token
        const response = await axios.get('http://localhost:3001/dashboard', { withCredentials: true });
        // Si el token es válido, redirige al dashboard
        if (response.status === 200) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Si hay algún error, el token no es válido o no existe
        console.error('No valid token, staying on login.', error);
      }
    };

    checkToken();
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/login', values, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
        // Redirigir al dashboard tras un login exitoso
        navigate('/dashboard');
      })
      .catch((error) => {
        console.error(error);
      });
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
