import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-indigo-600">GENIA</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900">Bienvenido a GENIA</h2>
                <p className="mt-2 text-gray-600">Plataforma SaaS con inteligencia artificial</p>
                <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
