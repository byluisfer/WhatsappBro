import React from 'react';

const InputField = ({ id, label, type }) => {
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        placeholder=""
        required
        className="peer w-full h-13 px-4 text-white bg-gray-900/50 rounded-xl border border-white/20 focus:outline-none focus:border-white"
      />
      <label
        htmlFor={id}
        className="absolute left-4 top-3 text-gray-400 text-base transition-all peer-placeholder-shown:opacity-100 peer-placeholder-shown:top-3 peer-focus:top-0 peer-focus:text-xs peer-focus:opacity-100 opacity-0"
      >
        {label}
      </label>
    </div>
  );
};

export default InputField;
