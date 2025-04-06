import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const Plans = () => {
  const { currentUser, updateUserPlan } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  
  // Función para actualizar el plan
  const handlePlanChange = async (plan, price) => {
    try {
      setLoading(true);
      setError('');
      
      // Llamada a la API para actualizar el plan
      const response = await fetch(`${process.env.REACT_APP_API_URL}/update_plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id,
          plan,
          price
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Actualizar el plan en el contexto
        updateUserPlan(plan);
        setSuccess(`Plan actualizado a ${plan.toUpperCase()} correctamente`);
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Error al actualizar el plan');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para iniciar prueba de 7 días
  const startTrial = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Llamada a la API para iniciar la prueba
      const response = await fetch(`${process.env.REACT_APP_API_URL}/start_trial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.id
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Actualizar el plan en el contexto
        updateUserPlan('starter');
        setSuccess('Prueba de 7 días iniciada correctamente');
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Error al iniciar la prueba');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-genia-secondary flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-genia-light">Planes y Suscripciones</h1>
            <p className="text-gray-400 mt-2">Elige el plan perfecto para tu negocio</p>
          </div>
          
          {/* Mensajes de error/éxito */}
          {error && (
            <div className="mb-6 bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-green-900 bg-opacity-20 border border-green-800 text-green-300 px-4 py-3 rounded">
              {success}
            </div>
          )}
          
          {/* Planes */}
          <div className="mt-10 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
            {/* Plan Free */}
            <div className={`card border-gray-700 hover:border-gray-500 transition-all duration-300 ${currentUser?.plan === 'free' ? 'border-genia-primary' : ''}`}>
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
                  <button 
                    onClick={() => handlePlanChange('free', 0)}
                    disabled={currentUser?.plan === 'free' || loading}
                    className={`w-full text-center ${currentUser?.plan === 'free' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'btn-secondary'}`}
                  >
                    {currentUser?.plan === 'free' ? 'Plan Actual' : 'Seleccionar Plan'}
                  </button>
                </div>
              </div>
            </div>

            {/* Plan Pro */}
            <div className={`card border-gray-700 hover:border-gray-500 transition-all duration-300 ${currentUser?.plan === 'pro' ? 'border-genia-primary' : ''}`}>
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
                  {currentUser?.plan === 'pro' ? (
                    <button 
                      disabled
                      className="w-full text-center bg-gray-700 text-gray-300 cursor-not-allowed py-2 px-4 rounded-lg"
                    >
                      Plan Actual
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePlanChange('pro', 29.99)}
                      disabled={loading}
                      className="btn-primary w-full text-center"
                    >
                      {loading ? 'Procesando...' : 'Seleccionar Plan'}
                    </button>
                  )}
                </div>
                {currentUser?.plan !== 'pro' && currentUser?.plan !== 'starter' && currentUser?.plan !== 'elite' && (
                  <div className="mt-4">
                    <button 
                      onClick={startTrial}
                      disabled={loading}
                      className="btn-secondary w-full text-center"
                    >
                      {loading ? 'Procesando...' : 'Prueba 7 días por $9.99'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Plan Elite */}
            <div className={`card border-gray-700 hover:border-gray-500 transition-all duration-300 ${currentUser?.plan === 'elite' ? 'border-genia-primary' : ''}`}>
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
                  <button 
                    onClick={() => handlePlanChange('elite', 99.99)}
                    disabled={currentUser?.plan === 'elite' || loading}
                    className={`w-full text-center ${currentUser?.plan === 'elite' ? 'bg-gray-700 text-gray-300 cursor-not-allowed' : 'btn-primary'}`}
                  >
                    {currentUser?.plan === 'elite' ? 'Plan Actual' : 'Seleccionar Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="mt-12 bg-genia-dark rounded-lg p-6">
            <h3 className="text-xl font-semibold text-genia-light mb-4">Información sobre los planes</h3>
            <p className="text-gray-400 mb-4">
              Todos los planes incluyen acceso a la plataforma GENIA y sus funcionalidades básicas. Los planes de pago se renuevan automáticamente al final del período.
            </p>
            <p className="text-gray-400 mb-4">
              La prueba de 7 días te da acceso completo al plan Pro por una semana a un precio reducido de $9.99. Después de los 7 días, se renovará automáticamente al precio regular de $29.99/mes a menos que canceles.
            </p>
            <p className="text-gray-400">
              Puedes cancelar tu suscripción en cualquier momento desde tu perfil de usuario.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;
