import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useOnboarding from '../hooks/useOnboarding';
import { sendWelcomeEmail } from '../services/makeService';
import { getUserStats } from '../services/supabaseService';

const OnboardingWizard = () => {
  const { currentUser } = useAuth();
  const { handleNewUserOnboarding } = useOnboarding();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  // Cargar datos del usuario
  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);
  
  // Obtener datos completos del usuario
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserStats(currentUser.id);
      setUserData(data);
    } catch (err) {
      setError('Error al cargar datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Completar el proceso de onboarding
  const completeOnboarding = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Ejecutar el proceso de onboarding
      const result = await handleNewUserOnboarding();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al completar el onboarding');
      }
      
      // Enviar correo de bienvenida con el link del clon
      await sendWelcomeEmail({
        ...currentUser,
        link_clon: result.link_clon
      });
      
      setSuccess('¡Onboarding completado con éxito!');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al completar el onboarding');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Avanzar al siguiente paso
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  // Retroceder al paso anterior
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Mostrar pantalla de carga
  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-genia-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-genia-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-genia-secondary flex flex-col justify-center items-center px-4 py-12">
      <div className="text-4xl font-bold text-genia-primary mb-8">GENIA</div>
      
      <div className="card max-w-2xl w-full p-6">
        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">Paso {step} de 4</span>
            <span className="text-sm text-gray-400">{step * 25}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-2 bg-genia-primary rounded-full transition-all duration-300"
              style={{ width: `${step * 25}%` }}
            ></div>
          </div>
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
        
        {/* Paso 1: Bienvenida */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-genia-light mb-4">¡Bienvenido a GENIA!</h2>
            <p className="text-gray-400 mb-6">
              Estamos emocionados de tenerte aquí. Vamos a configurar tu cuenta para que puedas comenzar a utilizar todas las funcionalidades de GENIA.
            </p>
            <div className="flex justify-center">
              <img 
                src="/assets/welcome-illustration.svg" 
                alt="Bienvenida a GENIA" 
                className="h-48 mb-6"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-gray-400 mb-8">
              En los siguientes pasos, configuraremos tu perfil, tus clones de IA personalizados y te mostraremos cómo sacar el máximo provecho de GENIA.
            </p>
            <button 
              onClick={nextStep}
              className="btn-primary w-full"
            >
              Comenzar
            </button>
          </div>
        )}
        
        {/* Paso 2: Perfil */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-genia-light mb-4">Tu Perfil</h2>
            <p className="text-gray-400 mb-6">
              Hemos creado tu perfil con la información que nos proporcionaste. Verifica que todo esté correcto.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                <div className="input-field bg-opacity-50">{currentUser?.nombre || 'No disponible'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="input-field bg-opacity-50">{currentUser?.email || 'No disponible'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Negocio</label>
                <div className="input-field bg-opacity-50">{currentUser?.negocio || 'No disponible'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Plan Actual</label>
                <div className="input-field bg-opacity-50 capitalize">{currentUser?.plan || 'Free'}</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={prevStep}
                className="btn-secondary"
              >
                Atrás
              </button>
              <button 
                onClick={nextStep}
                className="btn-primary"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
        
        {/* Paso 3: Clones */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-genia-light mb-4">Tus Clones de IA</h2>
            <p className="text-gray-400 mb-6">
              Basado en tu plan actual, tendrás acceso a los siguientes clones de IA personalizados:
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="card bg-genia-dark">
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-genia-primary bg-opacity-20 flex items-center justify-center text-genia-primary text-xl">
                    👨‍💼
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-genia-light">GENIA CEO</h3>
                    <p className="text-sm text-gray-400">
                      Tu asistente ejecutivo personal que te ayuda a tomar decisiones estratégicas y optimizar tus procesos de negocio.
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-genia-primary bg-opacity-20 text-genia-primary">
                        Disponible
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-genia-dark">
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-genia-primary bg-opacity-20 flex items-center justify-center text-genia-primary text-xl">
                    📊
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-genia-light flex items-center">
                      GENIA Funnel
                      {currentUser?.plan === 'free' && (
                        <svg className="ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Crea embudos de venta efectivos con páginas optimizadas, emails de seguimiento y secuencias de conversión.
                    </p>
                    <div className="mt-2">
                      {currentUser?.plan === 'free' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-700 text-gray-300">
                          Disponible en planes Pro y Elite
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-genia-primary bg-opacity-20 text-genia-primary">
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-genia-dark">
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-genia-primary bg-opacity-20 flex items-center justify-center text-genia-primary text-xl">
                    📝
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-genia-light flex items-center">
                      GENIA Content
                      {currentUser?.plan !== 'elite' && (
                        <svg className="ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Genera contenido de alta calidad para tus redes sociales, blog, emails y más con un solo clic.
                    </p>
                    <div className="mt-2">
                      {currentUser?.plan !== 'elite' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-700 text-gray-300">
                          Disponible en plan Elite
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-genia-primary bg-opacity-20 text-genia-primary">
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card bg-genia-dark">
                <div className="p-4 flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-md bg-genia-primary bg-opacity-20 flex items-center justify-center text-genia-primary text-xl">
                    🤖
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-genia-light flex items-center">
                      GENIA Bot
                      {currentUser?.plan !== 'elite' && (
                        <svg className="ml-2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Automatiza tus conversaciones en WhatsApp y otras plataformas para atender a tus clientes 24/7.
                    </p>
                    <div className="mt-2">
                      {currentUser?.plan !== 'elite' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-700 text-gray-300">
                          Disponible en plan Elite
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-genia-primary bg-opacity-20 text-genia-primary">
                          Disponible
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={prevStep}
                className="btn-secondary"
              >
                Atrás
              </button>
              <button 
                onClick={nextStep}
                className="btn-primary"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
        
        {/* Paso 4: Finalización */}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-genia-light mb-4">¡Todo listo!</h2>
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-900 bg-opacity-20 flex items-center justify-center text-green-500 text-4xl">
                ✓
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Tu cuenta de GENIA ha sido configurada correctamente. Ahora puedes comenzar a utilizar todas las funcionalidades disponibles en tu plan.
            </p>
            <p className="text-gray-400 mb-8">
              Recibirás un correo electrónico con un enlace directo a tu panel personalizado. También puedes acceder a tu panel desde cualquier dispositivo iniciando sesión con tu email.
            </p>
            <button 
              onClick={completeOnboarding}
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Finalizando...' : 'Finalizar y acceder a mi panel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
