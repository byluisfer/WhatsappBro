import React from 'react';

const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get the data from the inputs
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Convert the data in JSON and show a alert from the end result
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso!');
        console.log(data);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
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
          Register on WhatsappBro
        </h2>

        <form id="registerForm" className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              placeholder="Username"
              class="peer w-full h-13 px-4 text-white bg-gray-900/50 rounded-xl border border-white/20 placeholder-transparent focus:outline-none focus:border-white"
              required
              id="username"
              name="username"
              type="text"
            />
            <label
              htmlFor="username"
              class="absolute left-4 top-3 text-gray-400 text-base transition-all peer-placeholder-shown:opacity-100 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 opacity-0"
            >
              Username
            </label>
          </div>
          <div className="relative">
            <input
              placeholder="Email"
              className="peer w-full h-13 px-4 text-white bg-gray-900/50 rounded-xl border border-white/20 placeholder-transparent focus:outline-none focus:border-white"
              required
              id="email"
              name="email"
              type="email"
            />
            <label
              htmlFor="email"
              class="absolute left-4 top-3 text-gray-400 text-base transition-all peer-placeholder-shown:opacity-100 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 opacity-0"
            >
              Email
            </label>
          </div>
          <div className="relative">
            <input
              placeholder="Password"
              className="peer w-full h-13 px-4 text-white bg-gray-900/50 rounded-xl border border-white/20 placeholder-transparent focus:outline-none focus:border-white"
              required
              id="password"
              name="password"
              type="password"
            />
            <label
              htmlFor="password"
              class="absolute left-4 top-3 text-gray-400 text-base transition-all peer-placeholder-shown:opacity-100 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 opacity-0"
            >
              Password
            </label>
          </div>

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
            href="/login.html"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
