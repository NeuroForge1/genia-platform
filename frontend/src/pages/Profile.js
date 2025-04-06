import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { currentUser, updateUserPlan } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${currentUser.id}`);
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      setError('Error al cargar datos del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Generar código de referido
  const generateReferralCode = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate_referral_code/${currentUser.id}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.referral_code) {
        setUserData(prev => ({ ...prev, codigo_referido: data.referral_code }));
        setSuccess('Código de referido generado correctamente');
      }
    } catch (err) {
      setError('Error al generar código de referido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Copiar código de referido al portapapeles
  const copyReferralCode = () => {
    if (userData?.codigo_referido) {
      navigator.clipboard.writeText(userData.codigo_referido);
      setSuccess('Código copiado al portapapeles');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    }
  };
  
  // Mostrar pantalla de carga
  if (loading && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-genia-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-genia-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-genia-secondary flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 p-6 lg:p-10">
        <div className="max-w-4xl mx-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-genia-light">Perfil de Usuario</h1>
            <p className="text-gray-400 mt-2">Gestiona tu información y preferencias</p>
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
          
          {/* Información del perfil */}
          <div className="card mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-genia-light mb-4">Información Personal</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
          </div>
          
          {/* Sección de referidos */}
          <div className="card mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-genia-light mb-4">Programa de Referidos</h2>
              
              <p className="text-gray-400 mb-4">
                Invita a tus amigos a usar GENIA y obtén recompensas. Por cada persona que se registre con tu código, recibirás créditos adicionales.
              </p>
              
              {userData?.codigo_referido ? (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tu código de referido</label>
                  <div className="flex">
                    <div className="input-field bg-opacity-50 flex-1">{userData.codigo_referido}</div>
                    <button 
                      onClick={copyReferralCode}
                      className="ml-2 btn-secondary"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={generateReferralCode}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Generando...' : 'Generar Código de Referido'}
                </button>
              )}
              
              {userData?.referidos_count > 0 && (
                <div className="mt-4">
                  <p className="text-genia-light">
                    Has invitado a <span className="text-genia-primary font-bold">{userData.referidos_count}</span> personas a GENIA.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Sección de suscripción */}
          <div className="card mb-8">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-genia-light mb-4">Suscripción</h2>
              
              <div className="mb-4">
                <p className="text-gray-400">
                  Plan actual: <span className="text-genia-primary font-semibold capitalize">{currentUser?.plan || 'Free'}</span>
                </p>
                
                {userData?.subscription_end && (
                  <p className="text-gray-400 mt-2">
                    Tu suscripción se renovará el: <span className="text-genia-light">{new Date(userData.subscription_end).toLocaleDateString()}</span>
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/plans')}
                className="btn-primary"
              >
                Gestionar Suscripción
              </button>
            </div>
          </div>
          
          {/* Sección de API */}
          <div className="card">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-genia-light mb-4">API y Conexiones</h2>
              
              <p className="text-gray-400 mb-4">
                Conecta GENIA con tus otras herramientas y servicios.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-1">URL de tu clon</label>
                <div className="flex">
                  <div className="input-field bg-opacity-50 flex-1">
                    {currentUser?.link_clon || 'No disponible'}
                  </div>
                  <button 
                    onClick={() => {
                      if (currentUser?.link_clon) {
                        navigator.clipboard.writeText(currentUser.link_clon);
                        setSuccess('URL copiada al portapapeles');
                        setTimeout(() => setSuccess(''), 3000);
                      }
                    }}
                    className="ml-2 btn-secondary"
                    disabled={!currentUser?.link_clon}
                  >
                    Copiar
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-2">
                Usa esta URL para acceder directamente a tu panel de GENIA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
