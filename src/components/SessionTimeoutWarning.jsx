import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import authService from '../services/authService';

const SessionTimeoutWarning = () => {
  const { user, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = () => {
      const remaining = authService.getTokenTimeRemaining();
      setTimeRemaining(remaining);

      // Mostrar advertencia cuando queden menos de 5 minutos
      const shouldShowWarning = authService.willTokenExpireSoon(5);
      setShowWarning(shouldShowWarning);

      // Si el token expiró, cerrar sesión automáticamente
      if (remaining <= 0) {
        console.log('Token expirado, cerrando sesión automáticamente...');
        logout();
      }
    };

    // Verificar inmediatamente
    checkTokenExpiration();

    // Verificar cada 30 segundos
    const interval = setInterval(checkTokenExpiration, 30000);

    return () => clearInterval(interval);
  }, [user, logout]);

  const handleExtendSession = async () => {
    try {
      await authService.refreshToken();
      setShowWarning(false);
    } catch (error) {
      console.error('Error extendiendo sesión:', error);
      logout();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning || !user) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">
            Tu sesión expirará en {formatTime(timeRemaining)}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExtendSession}
            className="bg-black text-yellow-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Extender sesión
          </button>
          <button
            onClick={() => setShowWarning(false)}
            className="text-black hover:text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;