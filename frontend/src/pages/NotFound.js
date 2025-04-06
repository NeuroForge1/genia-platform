import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-genia-secondary flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-genia-primary">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-genia-light">Página no encontrada</h2>
        <p className="mt-2 text-lg text-gray-400">
          Lo sentimos, la página que estás buscando no existe.
        </p>
        <div className="mt-6">
          <Link to="/" className="btn-primary inline-flex items-center">
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
