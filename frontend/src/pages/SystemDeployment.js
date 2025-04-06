import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCheckoutSession, createCustomerPortalSession } from '../services/stripeService';
import { updateUserPlan } from '../services/supabaseService';
import { sendPlanUpdateEmail } from '../services/makeService';

// Componente para gestionar el proceso de despliegue del sistema completo
const SystemDeployment = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('pending'); // pending, in_progress, completed, failed
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentMessage, setDeploymentMessage] = useState('');
  const [deploymentError, setDeploymentError] = useState('');
  const [deploymentResult, setDeploymentResult] = useState(null);
  const navigate = useNavigate();
  
  // Iniciar el proceso de despliegue
  const startDeployment = async () => {
    try {
      setLoading(true);
      setDeploymentStatus('in_progress');
      setDeploymentMessage('Iniciando despliegue del sistema GENIA...');
      setDeploymentProgress(5);
      
      // Simular proceso de despliegue
      await simulateDeploymentSteps();
      
      // Actualizar estado final
      setDeploymentStatus('completed');
      setDeploymentMessage('¡Despliegue completado con éxito!');
      setDeploymentProgress(100);
      
      // Establecer resultado del despliegue
      setDeploymentResult({
        frontend_url: 'https://genia-platform.vercel.app',
        backend_url: 'https://genia-api.onrender.com',
        panel_url: currentUser?.link_clon || 'https://genia-platform.vercel.app/dashboard'
      });
      
    } catch (error) {
      console.error('Error en el despliegue:', error);
      setDeploymentStatus('failed');
      setDeploymentError(error.message || 'Error durante el despliegue del sistema');
      setDeploymentMessage('El despliegue ha fallado. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  // Simular pasos del despliegue
  const simulateDeploymentSteps = async () => {
    // Paso 1: Configurar base de datos
    setDeploymentMessage('Configurando base de datos en Supabase...');
    setDeploymentProgress(15);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Paso 2: Desplegar backend
    setDeploymentMessage('Desplegando backend en Render...');
    setDeploymentProgress(30);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Paso 3: Desplegar frontend
    setDeploymentMessage('Desplegando frontend en Vercel...');
    setDeploymentProgress(50);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Paso 4: Configurar webhooks
    setDeploymentMessage('Configurando webhooks en Make...');
    setDeploymentProgress(70);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Paso 5: Activar clones de IA
    setDeploymentMessage('Activando clones de IA...');
    setDeploymentProgress(85);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Paso 6: Verificar integración
    setDeploymentMessage('Verificando integración de todos los componentes...');
    setDeploymentProgress(95);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };
  
  // Volver al dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  // Abrir el panel de usuario
  const openUserPanel = () => {
    window.open(deploymentResult.panel_url, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-genia-secondary flex flex-col justify-center items-center p-4">
      <div className="text-4xl font-bold text-genia-primary mb-8">GENIA</div>
      
      <div className="card max-w-2xl w-full p-6">
        <h1 className="text-2xl font-bold text-genia-light mb-6 text-center">
          Despliegue del Sistema GENIA
        </h1>
        
        {/* Estado del despliegue */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-400">
              Estado: {
                deploymentStatus === 'pending' ? 'Pendiente' :
                deploymentStatus === 'in_progress' ? 'En progreso' :
                deploymentStatus === 'completed' ? 'Completado' :
                'Fallido'
              }
            </span>
            <span className="text-sm text-gray-400">{deploymentProgress}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                deploymentStatus === 'failed' ? 'bg-red-500' : 'bg-genia-primary'
              }`}
              style={{ width: `${deploymentProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Mensaje de despliegue */}
        <div className="mb-8 text-center">
          <p className="text-gray-300">{deploymentMessage}</p>
          {deploymentError && (
            <p className="text-red-400 mt-2">{deploymentError}</p>
          )}
        </div>
        
        {/* Resultado del despliegue */}
        {deploymentStatus === 'completed' && deploymentResult && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-genia-light mb-4 text-center">
              ¡Despliegue Exitoso!
            </h2>
            <div className="card bg-genia-dark p-4 mb-4">
              <h3 className="text-lg font-medium text-genia-light mb-2">URLs del Sistema</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-400">Frontend:</p>
                  <p className="text-genia-primary">{deploymentResult.frontend_url}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Backend:</p>
                  <p className="text-genia-primary">{deploymentResult.backend_url}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Panel de Usuario:</p>
                  <p className="text-genia-primary">{deploymentResult.panel_url}</p>
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-center mb-4">
              Tu sistema GENIA está listo para usar. Puedes acceder a tu panel personalizado haciendo clic en el botón de abajo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={openUserPanel}
                className="btn-primary"
              >
                Abrir Panel de Usuario
              </button>
              <button 
                onClick={goToDashboard}
                className="btn-secondary"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        )}
        
        {/* Botón para iniciar despliegue */}
        {deploymentStatus === 'pending' && (
          <div className="flex justify-center">
            <button 
              onClick={startDeployment}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Iniciando...' : 'Iniciar Despliegue'}
            </button>
          </div>
        )}
        
        {/* Botón para reintentar */}
        {deploymentStatus === 'failed' && (
          <div className="flex justify-center">
            <button 
              onClick={startDeployment}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Reiniciando...' : 'Reintentar Despliegue'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemDeployment;
