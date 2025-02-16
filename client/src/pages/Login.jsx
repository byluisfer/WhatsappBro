import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { apiRequest } from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the data from the inputs
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    try {
      // Send the data to the backend
      const data = await apiRequest('/login', 'POST', formData);
      if (data.error) {
        alert(data.error);
      } else {
        localStorage.setItem('token', data.token); // Save the token in local storage
        alert('Login successful!');
        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 to-gray-900 p-4">
      <div className="max-w-md w-full bg-white/5 rounded-2xl shadow-2xl overflow-hidden p-10 backdrop-blur-xl border border-white/20">
        <img
          src="./Logo.webp"
          alt="Logo"
          className="mx-auto mb-6 w-40 h-40 object-contain"
        />
        <h2 className="text-center text-3xl font-bold text-white mb-10">
          Login to WhatsappBro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField id="email" label="Email" type="email" />
          <InputField id="password" label="Password" type="password" />
          <button
            className="w-full py-3 px-4 bg-teal-900 cursor-pointer hover:bg-teal-600/50 rounded-2xl shadow-lg text-white font-semibold transition duration-300"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="text-center text-gray-300 mt-4">
          Don't have an account?
          <a
            className="hover:text-teal-700 ml-2 hover:underline transition-colors duration-300"
            href="/register"
          >
            Register
          </a>
        </div>
      </div>
    </div>
  );
};
export default Login;
