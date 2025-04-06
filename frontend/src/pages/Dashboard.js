import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import CloneCard from '../components/CloneCard';
import { getUserStats, getAvailableClones } from '../services/supabaseService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [availableClones, setAvailableClones] = useState(['ceo']);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Cargar estadísticas y clones disponibles
  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);
  
  // Obtener datos del usuario
  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas
      const statsData = await getUserStats(currentUser.id);
      
      if (statsData.error) {
        throw new Error(statsData.error);
      }
      
      setStats(statsData);
      
      // Obtener clones disponibles
      const clonesData = await getAvailableClones(currentUser.id);
      
      if (clonesData.error) {
        throw new Error(clonesData.error);
      }
      
      setAvailableClones(clonesData.available_clones);
    } catch (err) {
      console.error('Error al cargar datos del usuario:', err);
      setError('Error al cargar datos. Por favor, recarga la página.');
    } finally {
      setLoading(false);
    }
  };
  
  // Navegar a la interfaz de chat del clon seleccionado
  const handleCloneSelect = (cloneType) => {
    navigate(`/chat/${cloneType}`);
  };
  
  // Verificar si un clon está disponible
  const isCloneAvailable = (cloneType) => {
    return availableClones.includes(cloneType);
  };
  
  return (
    <div className="min-h-screen bg-genia-secondary flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 p-6 lg:p-10">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-genia-light">Dashboard</h1>
          <p className="text-gray-400 mt-2">Bienvenido de nuevo, {currentUser?.nombre || 'Usuario'}</p>
        </div>
        
        {/* Mensaje de error */}
        {error && (
          <div className="mb-6 bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Estadísticas */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-genia-light mb-4">Estadísticas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Créditos Disponibles" 
              value={stats?.creditos || 0}
              icon="💎"
              loading={loading}
            />
            <StatsCard 
              title="Chats Realizados" 
              value={stats?.total_chats || 0}
              icon="💬"
              loading={loading}
            />
            <StatsCard 
              title="Referidos" 
              value={stats?.total_referidos || 0}
              icon="👥"
              loading={loading}
            />
            <StatsCard 
              title="Plan Actual" 
              value={currentUser?.plan?.toUpperCase() || 'FREE'}
              icon="⭐"
              loading={loading}
            />
          </div>
        </div>
        
        {/* Clones */}
        <div>
          <h2 className="text-xl font-semibold text-genia-light mb-4">Tus Clones de IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CloneCard 
              name="GENIA CEO" 
              description="Tu asistente ejecutivo personal para estrategia de negocio."
              icon="👨‍💼"
              color="bg-blue-600"
              locked={!isCloneAvailable('ceo')}
              onClick={() => handleCloneSelect('ceo')}
            />
            <CloneCard 
              name="GENIA Funnel" 
              description="Crea embudos de venta efectivos y optimizados."
              icon="📊"
              color="bg-purple-600"
              locked={!isCloneAvailable('funnel')}
              onClick={() => handleCloneSelect('funnel')}
            />
            <CloneCard 
              name="GENIA Content" 
              description="Genera contenido de alta calidad para tus redes sociales."
              icon="📝"
              color="bg-green-600"
              locked={!isCloneAvailable('content')}
              onClick={() => handleCloneSelect('content')}
            />
            <CloneCard 
              name="GENIA Bot" 
              description="Automatiza tus conversaciones en WhatsApp y otras plataformas."
              icon="🤖"
              color="bg-red-600"
              locked={!isCloneAvailable('bot')}
              onClick={() => handleCloneSelect('bot')}
            />
          </div>
        </div>
        
        {/* Actualización de plan (solo para plan free) */}
        {currentUser?.plan === 'free' && (
          <div className="mt-10">
            <div className="card bg-gradient-to-r from-genia-dark to-genia-primary bg-opacity-20 p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-genia-light mb-2">¡Desbloquea todo el potencial de GENIA!</h3>
                  <p className="text-gray-300 mb-4">
                    Actualiza a un plan superior para acceder a todos los clones y funcionalidades avanzadas.
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <button 
                    onClick={() => navigate('/plans')}
                    className="btn-primary"
                  >
                    Ver Planes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
