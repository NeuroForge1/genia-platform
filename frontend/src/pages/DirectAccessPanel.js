import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

// Componente para manejar el acceso directo desde el enlace del panel
const DirectAccessPanel = () => {
  const { userId } = useParams();
  const { currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si ya hay un usuario autenticado, redirigir al dashboard
    if (currentUser) {
      navigate('/dashboard');
      return;
    }
    
    // Si no hay usuario, intentar autenticar con el ID del panel
    if (userId && !authLoading) {
      authenticateFromPanelId();
    }
  }, [userId, currentUser, authLoading]);
  
  // Función para autenticar al usuario a partir del ID del panel
  const authenticateFromPanelId = async () => {
    try {
      setLoading(true);
      
      // Extraer el ID real del usuario del parámetro de la URL
      // El formato esperado es: negocio-userId-timestamp
      const parts = userId.split('-');
      const actualUserId = parts[parts.length - 2]; // El penúltimo elemento debería ser el ID
      
      if (!actualUserId) {
        throw new Error('ID de usuario no válido');
      }
      
      // Buscar usuario en Supabase por ID
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${actualUserId}`);
      const userData = await response.json();
      
      if (!userData || userData.error) {
        throw new Error('Usuario no encontrado');
      }
      
      // Iniciar sesión con el email del usuario
      const { user, error: loginError } = await loginUser(userData.email);
      
      if (loginError || !user) {
        throw new Error(loginError || 'Error al iniciar sesión');
      }
      
      // Actualizar el contexto de autenticación
      // Nota: Esto se maneja automáticamente en el hook de autenticación
      
      // Redirigir al dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error al autenticar desde panel:', err);
      setError(err.message || 'Error al acceder al panel');
      
      // Redirigir a la página de inicio después de 3 segundos
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };
  
  // Mostrar pantalla de carga mientras se procesa
  if (loading) {
    return (
      <div className="min-h-screen bg-genia-secondary flex flex-col justify-center items-center">
        <div className="text-4xl font-bold text-genia-primary mb-4">GENIA</div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-genia-primary mb-4"></div>
        <p className="text-genia-light">Accediendo a tu panel personalizado...</p>
      </div>
    );
  }
  
  // Mostrar mensaje de error si ocurre algún problema
  if (error) {
    return (
      <div className="min-h-screen bg-genia-secondary flex flex-col justify-center items-center px-4">
        <div className="text-4xl font-bold text-genia-primary mb-4">GENIA</div>
        <div className="card max-w-md p-6 text-center">
          <svg className="h-12 w-12 text-red-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-genia-light mb-2">Error de acceso</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-gray-400">Redirigiendo a la página de inicio...</p>
        </div>
      </div>
    );
  }
  
  // Este return nunca debería ejecutarse debido a las redirecciones
  return null;
};

export default DirectAccessPanel;
