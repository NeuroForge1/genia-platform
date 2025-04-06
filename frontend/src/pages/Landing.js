import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-genia-secondary">
      {/* Header/Navbar */}
      <nav className="bg-genia-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-genia-primary">GENIA</div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-genia-light hover:text-genia-primary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn-primary">
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 py-8 sm:py-16 md:py-20 lg:py-28">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-genia-light sm:text-5xl md:text-6xl">
                <span className="block">Automatiza tu negocio con</span>
                <span className="block text-genia-primary">Inteligencia Artificial</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                GENIA es una plataforma SaaS con inteligencia artificial que automatiza contenido, embudos, campañas y tareas para negocios digitales.
              </p>
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                <div className="rounded-md shadow">
                  <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-genia-secondary bg-genia-primary hover:bg-opacity-90 md:py-4 md:text-lg md:px-10">
                    Comenzar Gratis
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-genia-primary bg-genia-dark hover:bg-gray-800 md:py-4 md:text-lg md:px-10">
                    Ver Funcionalidades
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-genia-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-genia-primary font-semibold tracking-wide uppercase">Funcionalidades</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-genia-light sm:text-4xl">
              Todo lo que necesitas para escalar tu negocio
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              GENIA te ofrece un ecosistema completo de herramientas impulsadas por IA para automatizar y optimizar tu negocio digital.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-genia-primary text-genia-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-genia-light">GENIA CEO</h3>
                  <p className="mt-2 text-base text-gray-300">
                    Tu asistente ejecutivo personal que te ayuda a tomar decisiones estratégicas y optimizar tus procesos de negocio.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-genia-primary text-genia-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-genia-light">GENIA Funnel</h3>
                  <p className="mt-2 text-base text-gray-300">
                    Crea embudos de venta efectivos con páginas optimizadas, emails de seguimiento y secuencias de conversión.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-genia-primary text-genia-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-genia-light">GENIA Content</h3>
                  <p className="mt-2 text-base text-gray-300">
                    Genera contenido de alta calidad para tus redes sociales, blog, emails y más con un solo clic.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="card">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-genia-primary text-genia-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-genia-light">GENIA Bot</h3>
                  <p className="mt-2 text-base text-gray-300">
                    Automatiza tus conversaciones en WhatsApp y otras plataformas para atender a tus clientes 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-12 bg-genia-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-genia-primary font-semibold tracking-wide uppercase">Planes</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-genia-light sm:text-4xl">
              Elige el plan perfecto para tu negocio
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              Tenemos opciones para cada etapa de tu negocio, desde emprendedores hasta empresas establecidas.
            </p>
          </div>

          <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {/* Plan Free */}
            <div className="card border-gray-700 hover:border-gray-500 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-genia-light">Free</h3>
                <p className="mt-4 text-gray-300">Perfecto para comenzar y probar la plataforma.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-genia-light">$0</span>
                  <span className="text-base font-medium text-gray-400">/mes</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Acceso a GENIA CEO básico</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">5 créditos de IA</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Soporte por email</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/register" className="btn-secondary w-full text-center">
                    Comenzar Gratis
                  </Link>
                </div>
              </div>
            </div>

            {/* Plan Pro */}
            <div className="card border-genia-primary hover:shadow-genia transition-all duration-300">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-genia-light">Pro</h3>
                <p className="mt-4 text-gray-300">Para negocios en crecimiento que necesitan más funcionalidades.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-genia-light">$29.99</span>
                  <span className="text-base font-medium text-gray-400">/mes</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Acceso a GENIA CEO completo</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Acceso a GENIA Funnel</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">50 créditos de IA mensuales</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Soporte prioritario</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/register" className="btn-primary w-full text-center">
                    Prueba 7 días por $9.99
                  </Link>
                </div>
              </div>
            </div>

            {/* Plan Elite */}
            <div className="card border-gray-700 hover:border-gray-500 transition-all duration-300">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-genia-light">Elite</h3>
                <p className="mt-4 text-gray-300">Para negocios que necesitan automatización completa.</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-genia-light">$99.99</span>
                  <span className="text-base font-medium text-gray-400">/mes</span>
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Acceso a todos los clones</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Créditos ilimitados</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Soporte VIP</span>
                  </li>
                  <li className="flex">
                    <svg className="h-6 w-6 text-genia-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-3 text-gray-300">Personalización avanzada</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link to="/register" className="btn-secondary w-full text-center">
                    Comenzar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-genia-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="text-2xl font-bold text-genia-primary">GENIA</div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400">
                &copy; 2025 GENIA. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
