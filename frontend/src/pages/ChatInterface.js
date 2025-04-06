import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import Sidebar from '../components/Sidebar';

const ChatInterface = () => {
  const { cloneType } = useParams();
  const { currentUser } = useAuth();
  const { messages, sendMessage, resetConversation, loading } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [typingIndicator, setTypingIndicator] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  
  // Inicializar mensajes para este clon si no existen
  useEffect(() => {
    if (!messages[cloneType]) {
      // Si el clon no está disponible, redirigir al dashboard
      if (!isCloneAvailable()) {
        navigate('/dashboard');
      }
    }
  }, [cloneType, messages]);
  
  // Scroll al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    scrollToBottom();
  }, [messages[cloneType]]);
  
  // Verificar si el clon está disponible según el plan del usuario
  const isCloneAvailable = () => {
    const plan = currentUser?.plan || 'free';
    
    // GENIA CEO disponible en todos los planes
    if (cloneType === 'ceo') return true;
    
    // GENIA Funnel disponible en planes Pro y Elite
    if (cloneType === 'funnel') return ['pro', 'elite'].includes(plan);
    
    // GENIA Content y Bot disponibles solo en plan Elite
    if (cloneType === 'content' || cloneType === 'bot') return plan === 'elite';
    
    return false;
  };
  
  // Scroll al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const message = inputMessage;
    setInputMessage('');
    setTypingIndicator(true);
    
    try {
      await sendMessage(message, cloneType);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setTypingIndicator(false);
    }
  };
  
  // Reiniciar conversación
  const handleResetConversation = async () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar la conversación? Se perderá todo el historial.')) {
      await resetConversation(cloneType);
    }
  };
  
  // Obtener nombre del clon
  const getCloneName = () => {
    switch (cloneType) {
      case 'ceo':
        return 'GENIA CEO';
      case 'funnel':
        return 'GENIA Funnel';
      case 'content':
        return 'GENIA Content';
      case 'bot':
        return 'GENIA Bot';
      default:
        return `GENIA ${cloneType.toUpperCase()}`;
    }
  };
  
  // Obtener icono del clon
  const getCloneIcon = () => {
    switch (cloneType) {
      case 'ceo':
        return '👨‍💼';
      case 'funnel':
        return '📊';
      case 'content':
        return '📝';
      case 'bot':
        return '🤖';
      default:
        return '🤖';
    }
  };
  
  return (
    <div className="min-h-screen bg-genia-secondary flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado del chat */}
        <div className="bg-genia-dark border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-genia-primary bg-opacity-20 flex items-center justify-center text-genia-primary text-xl">
              {getCloneIcon()}
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-medium text-genia-light">{getCloneName()}</h2>
              <p className="text-sm text-gray-400">Asistente de IA especializado</p>
            </div>
          </div>
          <button
            onClick={handleResetConversation}
            className="text-gray-400 hover:text-genia-primary"
            title="Reiniciar conversación"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Mensaje de bienvenida */}
          {(!messages[cloneType] || messages[cloneType].length === 0) && (
            <div className="flex justify-center my-8">
              <div className="card max-w-lg p-6 text-center">
                <div className="text-4xl mb-4">{getCloneIcon()}</div>
                <h3 className="text-xl font-bold text-genia-light mb-2">{getCloneName()}</h3>
                <p className="text-gray-400 mb-4">
                  {cloneType === 'ceo' && 'Tu asistente ejecutivo personal que te ayuda a tomar decisiones estratégicas y optimizar tus procesos de negocio.'}
                  {cloneType === 'funnel' && 'Crea embudos de venta efectivos con páginas optimizadas, emails de seguimiento y secuencias de conversión.'}
                  {cloneType === 'content' && 'Genera contenido de alta calidad para tus redes sociales, blog, emails y más con un solo clic.'}
                  {cloneType === 'bot' && 'Automatiza tus conversaciones en WhatsApp y otras plataformas para atender a tus clientes 24/7.'}
                </p>
                <p className="text-genia-primary">¡Comienza a chatear ahora!</p>
              </div>
            </div>
          )}
          
          {/* Mensajes */}
          {messages[cloneType]?.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-3xl rounded-lg px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-genia-primary text-genia-secondary' 
                    : 'bg-genia-dark text-genia-light'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-genia-secondary text-opacity-70' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Indicador de escritura */}
          {typingIndicator && (
            <div className="flex justify-start">
              <div className="max-w-3xl rounded-lg px-4 py-2 bg-genia-dark text-genia-light">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Referencia para scroll */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Área de entrada de mensaje */}
        <div className="bg-genia-dark border-t border-gray-800 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Escribe un mensaje a ${getCloneName()}...`}
              className="input-field flex-1"
              disabled={loading || typingIndicator}
            />
            <button
              type="submit"
              disabled={loading || typingIndicator || !inputMessage.trim()}
              className="btn-primary"
            >
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
