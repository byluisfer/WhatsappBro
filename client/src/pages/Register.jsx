import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    // Get the data from the inputs
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value, // Asure that the passwords match
    };

    // Validate that the passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      // Send the data to the backend and get the response
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Registration failed');
      } else {
        alert('User registered successfully!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred while registering');
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
          Register on WhatsappBro
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField id="username" label="Username" type="text" />
          <InputField id="email" label="Email" type="email" />
          <InputField id="password" label="Password" type="password" />
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          <button
            className="w-full py-3 px-4 bg-teal-900 cursor-pointer hover:bg-teal-600/50 rounded-2xl shadow-lg text-white font-semibold transition duration-300"
            type="submit"
          >
            Register
          </button>
        </form>

        <div className="text-center text-gray-300 mt-4">
          Have you an account?
          <a
            className="hover:text-teal-700 ml-2 hover:underline transition-colors duration-300"
            href="/login"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
