import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allow the acces from Docker
    port: 5173, // Asegure that the port is the same like the docker-compose
  },
  build: {
    outDir: 'dist', // Where the files will be generated
  },
  base: '/', // Asegure that the base is the same like the docker-compose
  root: __dirname, // Where the index.html is
});
