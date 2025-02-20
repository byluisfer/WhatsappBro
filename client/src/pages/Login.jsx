import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Get the data from the inputs
    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      // Send the data to the backend and get the response
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Login failed');
      } else {
        localStorage.setItem('token', data.token); // Save the token in local storage (for future use)
        alert('Login successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-900 to-gray-900 p-4">
      <div className="max-w-md w-full bg-white/5 rounded-2xl shadow-2xl overflow-hidden p-10 backdrop-blur-xl border border-white/20">
        <img
          src="./Logo.webp"
          alt="Logo"
          className="mx-auto mb-10 w-30 h-30 object-contain"
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
