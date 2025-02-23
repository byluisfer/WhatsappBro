import React from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import { useSnackbar } from 'notistack';

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    if (formData.password !== formData.confirmPassword) {
      enqueueSnackbar('Passwords do not match!', { variant: 'error' });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        enqueueSnackbar(data.error || 'Registration failed', {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('User registered successfully!', {
          variant: 'success',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      enqueueSnackbar('An error occurred while registering', {
        variant: 'error',
      });
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
